// Real-time collaboration features using Supabase Realtime and Socket.io
// If you want to chat, collaborate, or just yell into the void, this is the place.

import { createClient } from '@supabase/supabase-js';
import { io, Socket } from 'socket.io-client';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
let socket: Socket | null = null;

export function connectSocket() {
  if (!socket) {
    socket = io(process.env.SOCKET_IO_URL!);
  }
  return socket;
}

export function subscribeToChannel(channel: string, callback: (message: unknown) => void) {
  if (!socket) connectSocket();
  socket!.on(channel, callback);
}

export function sendMessage(channel: string, message: unknown) {
  if (!socket) connectSocket();
  socket!.emit(channel, message);
}

export async function subscribeToSupabase(table: string, callback: (payload: unknown) => void) {
  supabase
    .channel(table)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
}
