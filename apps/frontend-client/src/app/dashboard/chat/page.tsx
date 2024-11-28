"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatHeader } from '@/components/chat/chat-header';
import { ConversationListItem } from '@/components/chat/conversation-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessages } from '@/components/chat/chat-message';

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
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
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/messages/get/conversations`);
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }, []);

  // Fetch messages with pagination
  const fetchMessages = async (conversationId: string, pageNum: number, isNewConversation: boolean = false) => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/messages/${conversationId}?page=${pageNum}`);
      const newMessages = response.data.conversation.messages;

      if (isNewConversation) {
        setMessages(sortMessages(newMessages));
        setPage(1);
        setHasMore(true);
      } else {
        setMessages(prevMessages => {
          const allMessages = sortMessages([...newMessages, ...prevMessages]);
          return allMessages;
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
    setCurrentUser(conversation.receiver);
    setMessages([]);
    setPage(1);
    setHasMore(true);
    await fetchMessages(conversation.receiver, 1, true);
  };

  // Handle load more messages
  const handleLoadMore = async () => {
    if (selectedConversation && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchMessages(selectedConversation.receiver, nextPage, false);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!selectedConversation || messageInput.trim() === '') return;

    const optimisticMessage: Message = {
      _id: Date.now().toString(),
      senderId: currentUser,
      receiverId: selectedConversation.receiver,
      message: messageInput,
      conversationId: selectedConversation._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      setMessages(prevMessages => sortMessages([...prevMessages, optimisticMessage]));
      setMessageInput('');

      await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/messages/send/${selectedConversation.receiver}`, {
        message: messageInput
      });

      await fetchConversations();
      await fetchMessages(selectedConversation.receiver, 1, true);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== optimisticMessage._id)
      );
      setMessageInput(optimisticMessage.message);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-screen bg-slate-600">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-orange-500" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center bg-gray-50 rounded-full px-3 py-2">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="bg-transparent w-full focus:outline-none" 
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {conversations.map(conversation => (
            <ConversationListItem
              key={conversation._id}
              id={conversation._id}
              name={conversation.name}
              profile={conversation.profile}
              unreadCount={conversation.messages.length}
              isSelected={selectedConversation?._id === conversation._id}
              onClick={() => handleSelectConversation(conversation)}
            />
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader
              name={selectedConversation.name}
              profile={selectedConversation.profile}
              onBack={() => setSelectedConversation(null)}
            />

            <ChatMessages
              messages={messages}
              currentUser={currentUser}
              isLoading={loading}
              onLoadMore={handleLoadMore}
            />

            <ChatInput 
              value={messageInput} 
              onChange={setMessageInput} 
              onSend={handleSendMessage} 
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Welcome to Messages</h2>
              <p className="text-gray-400 mt-2">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;