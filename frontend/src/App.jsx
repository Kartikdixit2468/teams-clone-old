import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChannelList from "./components/ChannelList";
import ChatArea from "./components/ChatArea";
import "./App.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

function App() {
  const [socket, setSocket] = useState(null);
  const [teams, setTeams] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser] = useState({ id: "user-1", name: "You", avatar: "👤" });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
      fetchInitialData();
    });

    newSocket.on("new_message", (message) => {
      if (message.channelId === currentChannel?.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    newSocket.on("presence_update", ({ userId, status }) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status } : user))
      );
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch initial data from backend
  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/env/state`);
      const data = await response.json();

      if (data.success) {
        setTeams(data.state.teams);
        setUsers(data.state.users);

        // Set initial channel
        if (
          data.state.teams.length > 0 &&
          data.state.teams[0].channels.length > 0
        ) {
          const firstChannel = data.state.teams[0].channels[0];
          setCurrentChannel(firstChannel);
          setMessages(data.state.recentMessages || []);

          // Join the channel room
          if (socket) {
            socket.emit("join_channel", firstChannel.id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleChannelSwitch = (channel) => {
    if (currentChannel && socket) {
      socket.emit("leave_channel", currentChannel.id);
    }

    setCurrentChannel(channel);
    setMessages([]); // Clear messages (in real app, fetch from backend)

    if (socket) {
      socket.emit("join_channel", channel.id);
    }

    // Fetch messages for this channel
    fetchChannelMessages(channel.id);
  };

  const fetchChannelMessages = async (channelId) => {
    // In a real implementation, fetch from backend
    // For now, we'll get them from the environment state
    try {
      const response = await fetch(`${SOCKET_URL}/env/state`);
      const data = await response.json();

      if (data.success) {
        // Filter messages for this channel (mock)
        setMessages(data.state.recentMessages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = (content) => {
    if (!socket || !currentChannel) return;

    const messageData = {
      channelId: currentChannel.id,
      userId: currentUser.id,
      content,
    };

    socket.emit("send_message", messageData);
  };

  return (
    <div className="app-container">
      <Header currentUser={currentUser} />
      <div className="teams-layout">
        <Sidebar teams={teams} />
        <ChannelList
          teams={teams}
          currentChannel={currentChannel}
          onChannelSwitch={handleChannelSwitch}
        />
        <ChatArea
          channel={currentChannel}
          messages={messages}
          users={users}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;
