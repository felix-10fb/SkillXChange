"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Send, MessageSquare, Search, User, Sparkles, Circle } from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = () => {
    fetchApi("/conversations")
      .then((data) => {
        setConversations(data);
        if (data.length > 0 && !selectedConv) {
          selectConversation(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const selectConversation = (conv: any) => {
    setSelectedConv(conv);
    fetchMessages(conv.id);

    // Setup WebSocket connection
    if (socketRef.current) {
      socketRef.current.close();
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/${conv.id}?user_id=${user?.id}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msgData = JSON.parse(event.data);
        if (msgData.content) {
          setMessages((prev) => [...prev, msgData]);
        }
      } catch (e) {}
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    socketRef.current = ws;
  };

  const fetchMessages = (convId: string) => {
    fetchApi(`/conversations/${convId}/messages`)
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      })
      .catch(() => {});
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedConv) return;

    const content = newMessageText;
    setNewMessageText("");

    try {
      const sentMsg = await fetchApi(`/conversations/${selectedConv.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      // Optimistic update if WebSocket didn't duplicate
      setMessages((prev) => (prev.some((m) => m.id === sentMsg.id) ? prev : [...prev, sentMsg]));
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <h1 className="text-2xl font-extrabold text-[#161F30] mb-6">Real-Time Messaging</h1>

        <div className="bg-white rounded-3xl border border-[#2E1A5E]/10 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] flex-1">
          {/* Left Sidebar: Conversations List */}
          <div className="md:col-span-4 border-r border-gray-100 flex flex-col bg-[#FFF8F0]/50">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#2E1A5E]/10 rounded-xl text-xs focus:outline-none focus:border-[#2E1A5E]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loading ? (
                <div className="p-4 text-xs text-gray-400">Loading chats...</div>
              ) : conversations.length > 0 ? (
                conversations.map((c) => {
                  const isSelected = selectedConv?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => selectConversation(c)}
                      className={`p-4 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected ? "bg-[#2E1A5E] text-white" : "hover:bg-white"
                      }`}
                    >
                      <img
                        src={c.other_user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.other_user_name)}&background=2E1A5E&color=fff`}
                        alt={c.other_user_name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-[#161F30]"}`}>
                            {c.other_user_name}
                          </h4>
                          {c.unread_count > 0 && (
                            <span className="px-1.5 py-0.5 bg-[#E36648] text-white text-[9px] font-bold rounded-full">
                              {c.unread_count}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                          {c.last_message}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-gray-400">
                  No active conversations yet. Start an exchange to open a chat!
                </div>
              )}
            </div>
          </div>

          {/* Right Main Chat Window */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FFF8F0]/30">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConv.other_user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConv.other_user_name)}&background=2E1A5E&color=fff`}
                      alt={selectedConv.other_user_name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-extrabold text-[#161F30] text-sm">{selectedConv.other_user_name}</h3>
                      <span className="text-[10px] text-gray-500">@{selectedConv.other_user_username}</span>
                    </div>
                  </div>

                  {/* Real-Time WebSocket Indicator */}
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Circle className="w-2 h-2 fill-emerald-500" />
                    <span>WebSocket Live</span>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFF8F0]/20 min-h-[360px]">
                  {messages.map((m, idx) => {
                    const isMe = m.sender_id === user?.id;
                    return (
                      <div
                        key={idx}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-[#2E1A5E] text-[#FFF8F0] rounded-br-none"
                              : "bg-white text-[#161F30] border border-[#2E1A5E]/10 rounded-bl-none"
                          }`}
                        >
                          <p>{m.content}</p>
                          <span className={`text-[9px] block text-right mt-1 ${isMe ? "text-gray-300" : "text-gray-400"}`}>
                            {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={`Type a message to ${selectedConv.other_user_name}...`}
                    className="flex-1 px-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-2xl text-xs focus:outline-none focus:border-[#2E1A5E]"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-[#E36648] text-white rounded-2xl hover:opacity-90 transition-all shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-sm font-semibold">Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
