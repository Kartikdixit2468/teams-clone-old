import { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip, MoreVertical } from "lucide-react";
import Message from "./Message";

function ChatArea({ channel, messages, users, currentUser, onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const getUserById = (userId) => {
    return (
      users.find((u) => u.id === userId) || {
        name: "Unknown",
        avatar: "❓",
        status: "offline",
      }
    );
  };

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">
            Select a channel to start
          </h2>
          <p className="text-gray-500 mt-2">
            Choose a channel from the left sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel Header */}
      <div className="h-16 border-b border-gray-300 flex items-center justify-between px-6">
        <div>
          <h2 className="text-xl font-semibold">#{channel.name}</h2>
          <p className="text-sm text-gray-600">{users.length} members</p>
        </div>
        <button className="hover:bg-gray-200 p-2 rounded">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              user={getUserById(message.userId)}
              isCurrentUser={message.userId === currentUser.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-300 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button type="button" className="hover:bg-gray-200 p-2 rounded">
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teams-purple"
          />

          <button type="button" className="hover:bg-gray-200 p-2 rounded">
            <Smile size={20} />
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-teams-purple text-white p-2 rounded-lg hover:bg-teams-darkpurple disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
