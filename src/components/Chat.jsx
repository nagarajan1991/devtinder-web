import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useUserStatus } from "../contexts/UserStatusContext";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [canChat, setCanChat] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const { isUserOnline, getStatusText } = useUserStatus();
  const navigate = useNavigate();

  // Format timestamp to show relative time
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  // Fetch chat partner details
  useEffect(() => {
    const fetchChatPartner = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/profile/" + targetUserId, {
          withCredentials: true,
        });
        setChatPartner(res.data);
      } catch (err) {
        console.error("Error fetching chat partner:", err);
      }
    };
    if (targetUserId) {
      fetchChatPartner();
    }
  }, [targetUserId]);

  // Check if user can chat
  useEffect(() => {
    const checkChatPermission = async () => {
      try {
        const res = await axios.get(BASE_URL + "/premium/verify", {
          withCredentials: true,
        });
        
        const { isPremium, membershipType, membershipExpiry } = res.data;
        
        // Check if membership is valid
        if (isPremium && membershipExpiry) {
          const now = new Date();
          const expiry = new Date(membershipExpiry);
          
          if (now < expiry) {
            setCanChat(true);
            return;
          }
        }
        
        // If not premium or expired, redirect to premium page
        navigate('/premium');
      } catch (err) {
        console.error("Error checking chat permission:", err);
        navigate('/premium');
      }
    };

    checkChatPermission();
  }, [navigate]);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          createdAt,
        };
      });
      setMessages(chatMessages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    
    // Join chat room
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    // Listen for new messages
    socket.on("messageReceived", ({ firstName, lastName, text, createdAt }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text, createdAt: createdAt || new Date() }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user?.firstName]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="h-screen bg-base-200 flex flex-col">
      {/* Chat Header - Fixed height */}
      <div className="bg-base-100 shadow-lg border-b border-base-300">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/connections" className="btn btn-ghost btn-sm btn-circle">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">💬</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-base-content leading-tight">
                  {chatPartner ? (
                    <span className="flex items-center gap-1">
                      <span>Chatroom with</span>
                      <span className="text-primary">{chatPartner.firstName}</span>
                    </span>
                  ) : (
                    "Loading..."
                  )}
                </h1>
                {targetUserId && (
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isUserOnline(targetUserId) ? 'bg-success' : 'bg-base-300'}`}></div>
                    <span className="text-xs text-base-content opacity-60">
                      {getStatusText(targetUserId)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container - Fills remaining height */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-4rem)]">
        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-base-content opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">Start the conversation</h3>
              <p className="text-base-content opacity-70">Send your first message to begin chatting!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = user.firstName === msg.firstName;
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isOwnMessage 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                        : 'bg-base-300 text-base-content'
                    }`}>
                      {msg.firstName?.charAt(0)}{msg.lastName?.charAt(0)}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-md' 
                          : 'bg-base-100 text-base-content border border-base-300 rounded-bl-md'
                      } shadow-sm`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <div className={`text-xs text-base-content opacity-50 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {msg.firstName} • {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="bg-base-100 border-t border-base-300 p-3 sticky bottom-0 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {canChat ? (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && sendMessage()}
                    placeholder="Type your message..."
                    className="input input-bordered w-full pr-12 focus:input-primary h-10"
                    autoComplete="off"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost btn-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18l9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-base-200 rounded-lg px-4 py-2">
                <span className="text-sm text-base-content/70">Upgrade to premium to chat</span>
                <button 
                  onClick={() => navigate('/premium')}
                  className="btn btn-warning btn-sm"
                >
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;