import { MoreVertical } from "lucide-react";

function Message({ message, user, isCurrentUser }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "status-available";
      case "busy":
        return "status-busy";
      case "away":
        return "status-away";
      default:
        return "status-offline";
    }
  };

  return (
    <div
      className={`flex space-x-3 hover:bg-gray-50 p-2 rounded message-enter ${
        isCurrentUser ? "bg-blue-50" : ""
      }`}
    >
      <div className="relative">
        <span className="text-3xl">{user.avatar}</span>
        <span
          className={`status-indicator ${getStatusColor(
            user.status
          )} absolute bottom-0 right-0 border-2 border-white`}
        ></span>
      </div>

      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{user.name}</span>
          {isCurrentUser && (
            <span className="text-xs text-gray-500">(You)</span>
          )}
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <p className="text-sm mt-1 text-gray-800">{message.content}</p>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex space-x-1 mt-2">
            {message.reactions.map((reaction, idx) => (
              <span
                key={idx}
                className="bg-gray-200 px-2 py-1 rounded-full text-xs"
              >
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>

      <button className="opacity-0 hover:opacity-100 hover:bg-gray-200 p-1 rounded h-fit">
        <MoreVertical size={16} />
      </button>
    </div>
  );
}

export default Message;
