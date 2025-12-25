/**
 * Real-time Messaging System
 * Handles direct messages and conversations
 */

import Pusher from 'pusher';
import { prisma } from '@/core/database/prisma-client';

const pusher = process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER || 'us2',
      useTLS: true,
    })
  : null;

/**
 * Create or get existing conversation between users
 */
export async function createOrGetConversation(
  userIds: string[],
  type: 'direct' | 'group' = 'direct',
  groupId?: string
) {
  try {
    // For direct messages, check if conversation exists
    if (type === 'direct' && userIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'direct',
          participants: {
            every: {
              userId: { in: userIds },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (existingConversation?.participants.length === 2) {
        return existingConversation;
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        type,
        groupId,
        participants: {
          create: userIds.map(userId => ({ userId })),
        },
      },
      include: {
        participants: true,
      },
    });

    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

/**
 * Send a message
 */
export async function sendMessage(params: {
  conversationId: string;
  senderId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system';
  attachmentUrl?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Verify sender is participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: params.conversationId,
          userId: params.senderId,
        },
      },
    });

    if (!participant) {
      return {
        success: false,
        error: 'User is not a participant in this conversation',
      };
    }

    // Create message
    const message = await prisma.directMessage.create({
      data: {
        conversationId: params.conversationId,
        senderId: params.senderId,
        content: params.content,
        type: params.type || 'text',
        attachmentUrl: params.attachmentUrl,
      },
    });

    // Update conversation's last message timestamp
    await prisma.conversation.update({
      where: { id: params.conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Send real-time notification via Pusher
    if (pusher) {
      await pusher.trigger(
        `conversation-${params.conversationId}`,
        'new-message',
        {
          messageId: message.id,
          senderId: params.senderId,
          content: params.content,
          type: params.type || 'text',
          createdAt: message.createdAt,
        }
      );
    }

    return {
      success: true,
      messageId: message.id,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

/**
 * Get messages from a conversation
 */
export async function getConversationMessages(
  conversationId: string,
  userId: string,
  options: {
    limit?: number;
    before?: string; // Message ID for pagination
  } = {}
) {
  const { limit = 50, before } = options;

  // Verify user is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  });

  if (!participant) {
    throw new Error('User is not a participant in this conversation');
  }

  const messages = await prisma.directMessage.findMany({
    where: {
      conversationId,
      isDeleted: false,
      ...(before ? {
        createdAt: {
          lt: (await prisma.directMessage.findUnique({
            where: { id: before },
          }))?.createdAt,
        },
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return messages.reverse(); // Return in chronological order
}

/**
 * Mark messages as read
 */
export async function markAsRead(
  conversationId: string,
  userId: string
) {
  try {
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking as read:', error);
    return { success: false };
  }
}

/**
 * Get user's conversations
 */
export async function getUserConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        include: {
          conversation: false,
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
  });

  return conversations;
}

/**
 * Get unread message count
 */
export async function getUnreadCount(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        where: { userId },
      },
      messages: {
        where: {
          createdAt: {
            gt: new Date(0), // Will be replaced with participant's lastReadAt
          },
        },
      },
    },
  });

  let totalUnread = 0;

  for (const conversation of conversations) {
    const participant = conversation.participants[0];
    if (participant) {
      const unreadMessages = await prisma.directMessage.count({
        where: {
          conversationId: conversation.id,
          createdAt: { gt: participant.lastReadAt },
          senderId: { not: userId },
        },
      });
      totalUnread += unreadMessages;
    }
  }

  return totalUnread;
}

/**
 * Delete a message
 */
export async function deleteMessage(
  messageId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const message = await prisma.directMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    if (message.senderId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.directMessage.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        content: '[Message deleted]',
      },
    });

    // Send real-time notification
    if (pusher) {
      await pusher.trigger(
        `conversation-${message.conversationId}`,
        'message-deleted',
        { messageId }
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete message',
    };
  }
}
