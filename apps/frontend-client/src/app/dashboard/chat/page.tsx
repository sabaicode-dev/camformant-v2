"use client";
import React, { useEffect, useState } from "react";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import ChatPage from "./chat";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import Image from "next/image";
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Search, 
  MoreHorizontal, 
  ChevronLeft,
  Send
} from 'lucide-react';
interface Conversations {
  _id: string;
  receiver: string;
  messages: string[];
  updatedAt: Date;
  role: string;
  name: string;
  profile: string;
}


// Dummy data types
interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    avatar: '/placeholder-avatar.png', 
    lastMessage: 'Hey, how are you?', 
    unreadCount: 2,
    isOnline: true 
  },
  // { 
  //   id: '2', 
  //   name: 'Jane Smith', 
  //   avatar: '/placeholder-avatar.png', 
  //   lastMessage: 'Meeting at 3 PM', 
  //   unreadCount: 0,
  //   isOnline: false 
  // },
];

const mockMessages: { [key: string]: Message[] } = {
  '1': [
    { 
      id: 'm1', 
      sender: '1', 
      content: 'Hey, how are you?', 
      timestamp: new Date(),
      isRead: true 
    },
    { 
      id: 'm2', 
      sender: 'me', 
      content: 'I\'m good, thanks!', 
      timestamp: new Date(),
      isRead: true 
    }
  ]
};


const Chat = () => {
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [message, setMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (!selectedUser || messageInput.trim() === '') return;

    // In a real app, this would be an API call
    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: 'me',
      content: messageInput,
      timestamp: new Date(),
      isRead: false
    };

    // Update messages (would be an API call in real implementation)
    mockMessages[selectedUser.id].push(newMessage);
    setMessageInput('');
  };


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_CONVERSATIONS}`
        );
        console.log("Conversations fetched:", response.data);
        setConversations(response.data.conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);
  console.log("conversations:::::::::::::::::::::;;;" ,conversations);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        "http://localhost:4000/v1/messages/send/672ef3cd4acf5254583a8001",
        { message }
      );
      console.log("Message sent:", response.data);
      setMessage(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <DynamicBreadcrumb />
    {/* <ChatPage />
      <div>
        {conversations.map((conversation: any) => (
          <div key={conversation._id}>
            <Image
              src={conversation.profile}
              alt={conversation.name}
              width={50}
              height={50}
            />
            <div>{conversation.name}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          required
        />
        <button type="submit">Send</button>
      </form> */}
      {/* <div className="">

      </div> */}
      <div className="flex h-screen bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-96 bg-white border-r">
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-blue-600" />
            <h2 className="text-xl font-semibold">Chats</h2>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Search Messenger" 
              className="bg-transparent w-full focus:outline-none" 
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto">
          {mockUsers.map(user => (
            <div 
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`
                flex items-center p-3 hover:bg-gray-100 cursor-pointer
                ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}
              `}
            >
              <div className="relative mr-3">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{user.name}</h3>
                  {user.unreadCount && user.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {user.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-grow flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="md:hidden"
                >
                  <ChevronLeft />
                </button>
                <div className="relative">
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                  {selectedUser.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="hover:bg-gray-100 p-2 rounded-full">
                  <Phone />
                </button>
                <button className="hover:bg-gray-100 p-2 rounded-full">
                  <Video />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {mockMessages[selectedUser.id].map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className={`
                      max-w-[70%] p-3 rounded-2xl
                      ${message.sender === 'me' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-black'}
                    `}
                  >
                    {message.content}
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t flex items-center space-x-3">
              <button className="hover:bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <input 
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 bg-gray-100 rounded-full focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <Send />
              </button>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-grow flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl">Select a chat</h2>
              <p>Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>

    </>
  );
};

export default Chat;