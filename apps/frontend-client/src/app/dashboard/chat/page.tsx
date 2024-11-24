"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Search, 
  MoreHorizontal, 
  ChevronLeft,
  Send
} from 'lucide-react';
import axiosInstance from '@/utils/axios';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  _id: string;
  receiver: string;
  messages: string[];
  updatedAt: string;
  role: string;
  profile: string;
  name: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}

const ChatDashboard: React.FC = () => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentUser, setCurrentUser] = useState('672ef3cd4acf5254583a8001');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Sort messages helper function
  const sortMessages = (msgs: Message[]): Message[] => {
    return [...msgs].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await axiosInstance.get('http://localhost:4000/v1/messages/get/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }, []);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, []);

  // Fetch messages with pagination
  const fetchMessages = async (conversationId: string, pageNum: number, isNewConversation: boolean = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`http://localhost:4000/v1/messages/${conversationId}?page=${pageNum}`);
      const newMessages = response.data.conversation.messages;

      if (isNewConversation) {
        // For new conversation, sort all messages
        setMessages(sortMessages(newMessages));
        setPage(1);
        setHasMore(true);
        setTimeout(scrollToBottom, 100);
      } else {
        // For pagination, merge and sort all messages
        setMessages(prevMessages => {
          const allMessages = [...prevMessages, ...newMessages];
          return sortMessages(allMessages);
        });
        setHasMore(newMessages.length > 0);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages([]); // Clear existing messages
    await fetchMessages(conversation.receiver, 1, true);
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!selectedConversation || messageInput.trim() === '') return;

    const optimisticMessage: Message = {
      _id: Date.now().toString(), // Temporary ID
      senderId: currentUser,
      receiverId: selectedConversation.receiver,
      message: messageInput,
      conversationId: selectedConversation._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Add optimistic message
      setMessages(prevMessages => sortMessages([...prevMessages, optimisticMessage]));
      setMessageInput('');
      setTimeout(scrollToBottom, 100);

      // Actually send the message
      await axiosInstance.post(`http://localhost:4000/v1/messages/send/${selectedConversation.receiver}`, {
        message: messageInput
      });

      // Update conversations list
      await fetchConversations();
      
      // Refresh messages to get the real message ID
      await fetchMessages(selectedConversation.receiver, 1, true);

    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== optimisticMessage._id)
      );
      setMessageInput(optimisticMessage.message); // Restore the message input
    }
  };

  // Scroll handler for infinite scroll
  useEffect(() => {
    const messageContainer = messageRef.current;
    
    const handleScroll = async (event: Event) => {
      const target = event.target as HTMLDivElement;
      const scrollTop = Math.round(target.scrollTop);

      if (scrollTop === 0 && !loading && hasMore && selectedConversation) {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchMessages(selectedConversation.receiver, nextPage, false);
      }
    };

    if (messageContainer) {
      messageContainer.addEventListener('scroll', handleScroll);
      return () => {
        messageContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [selectedConversation, page, loading, hasMore]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  // Add loading indicator component
  const LoadingIndicator = () => (
    <div className="text-center py-2">
      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-r-transparent"></div>
    </div>
  );

  return (
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
          {conversations.map(conversation => (
            <div 
              key={conversation._id}
              onClick={() => handleSelectConversation(conversation)}
              className={`
                flex items-center p-3 hover:bg-gray-100 cursor-pointer
                ${selectedConversation?._id === conversation._id ? 'bg-gray-100' : ''}
              `}
            >
              <div className="relative mr-3">
                <img 
                  src={conversation.profile} 
                  alt={conversation.name} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{conversation.name}</h3>
                  {conversation.messages.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.messages.length}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  Last message placeholder
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-grow flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedConversation(null)} 
                  className="md:hidden"
                >
                  <ChevronLeft />
                </button>
                <div className="relative">
                  <img 
                    src={selectedConversation.profile} 
                    alt={selectedConversation.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConversation.name}</h3>
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

    {/* Messages Container with Loading Indicator */}
    <div className="flex-1 overflow-y-auto px-4" ref={messageRef}>
              {loading && page === 1 ? (
                <LoadingIndicator />
              ) : (
                <div className="space-y-4">
                  {loading && page > 1 && <LoadingIndicator />}
                  {messages.map(message => (
                    <div 
                      key={message._id} 
                      className={`flex ${
                        message.senderId === currentUser ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div 
                        className={`
                          max-w-[70%] p-3 rounded-2xl
                          ${message.senderId === currentUser 
                            ? 'bg-gray-200 text-black' 
                            : 'bg-blue-500 text-white'}
                        `}
                      >
                        {message.message}
                        <div className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
  );
};

export default ChatDashboard;