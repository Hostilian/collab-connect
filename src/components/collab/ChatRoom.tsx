"use client";
// Real-time chat room using Supabase Realtime and Socket.io
import { useEffect, useState } from "react";
import { connectSocket, subscribeToChannel, sendMessage } from "@/lib/collab-realtime";

interface ChatRoomProps {
  room: string;
  user: { id: string; name: string };
}

export default function ChatRoom({ room, user }: ChatRoomProps) {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    connectSocket();
    subscribeToChannel(room, (msg) => {
      setMessages((prev) => [...prev, msg as { user: string; text: string }]);
    });
  }, [room]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(room, { user: user.name, text: input });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold text-indigo-600">{msg.user}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex p-2 border-t bg-white">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button className="ml-2 px-4 py-1 bg-indigo-600 text-white rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
