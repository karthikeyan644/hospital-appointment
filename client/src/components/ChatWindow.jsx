import { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import api from "./utils/api";
import { Send, X, MessageSquare } from "lucide-react";

function ChatWindow({ receiverId, receiverName, onClose }) {
  const { user, socket } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history from DB
  useEffect(() => {
    if (!receiverId) return;
    
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/messages/history/${receiverId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load chat history", error);
      }
    };

    fetchHistory();
  }, [receiverId]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      // Check if message belongs to this conversation
      if (
        (msg.senderId === receiverId && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === receiverId) ||
        (receiverId === "admin" && (msg.receiverId === "admin" || msg.senderId === "admin"))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, receiverId, user.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const msgData = {
      senderId: user.id,
      senderName: user.name,
      receiverId: receiverId,
      content: newMessage.trim(),
    };

    // Emit to Socket.IO (will be saved in DB on backend & broadcast)
    socket.emit("send_message", msgData);
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-teal-700/30 rounded-lg">
            <MessageSquare className="w-5 h-5 text-teal-100" />
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wide">{receiverName}</h4>
            <span className="text-[10px] text-teal-100/80 font-medium">Real-time consultation</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-teal-700/30 rounded-full transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
            <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-xs">Start a secure real-time discussion regarding medical requests.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === user.id;
            return (
              <div
                key={msg._id || index}
                className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isOwn
                      ? "bg-teal-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.senderName} • {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-slate-50/50"
        />
        <button
          type="submit"
          className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
