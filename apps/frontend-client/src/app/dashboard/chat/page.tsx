"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Search, MoreHorizontal } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatHeader } from '@/components/chat/chat-header';
import { ConversationListItem } from '@/components/chat/conversation-list-item';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/Spinner';

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
  const { user } = useAuth();
  const messageRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sortMessages = (msgs: Message[]): Message[] => {
    return [...msgs].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  const fetchConversations = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/messages/get/conversations`);
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }, []);

  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'auto') => {
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: behavior
      });
    }
  }, []);

  const fetchMessages = async (conversationId: string, pageNum: number, isNewConversation: boolean = false) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/messages/${conversationId}?page=${pageNum}&limit=24`);
      const newMessages = response.data.conversation.messages;
  
      setMessages(prevMessages => {
        if (isNewConversation) {
          return sortMessages(newMessages); 
        }
  
        const combinedMessages = [
          ...newMessages.filter((msg: { _id: string; }) => !prevMessages.some(existingMsg => existingMsg._id === msg._id)),
          ...prevMessages,
        ];
  
        return sortMessages(combinedMessages); 
      });
  
      setHasMore(newMessages.length > 0);
      setPage(pageNum);
  
      if (isNewConversation) {
        setTimeout(() => scrollToBottom('smooth'), 100);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectConversation = async (conversation: Conversation) => {
    if (selectedConversation && selectedConversation?._id === conversation._id) return;
    setSelectedConversation(conversation);
    setMessages([]); 
    setPage(1);
    setHasMore(true);
    await fetchMessages(conversation.receiver, 1, true);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || messageInput.trim() === '') return;
  
    if (messages.length > 0 && messages[messages.length - 1].message === messageInput) {
      console.log('Duplicate message detected. Not sending.');
      return;
    }
  
    const optimisticMessage: Message = {
      _id: Date.now().toString(),
      senderId: user?._id || '',
      receiverId: selectedConversation.receiver,
      message: messageInput,
      conversationId: selectedConversation._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  
    try {
      setMessages(prevMessages => sortMessages([...prevMessages, optimisticMessage]));
      setMessageInput('');
      setTimeout(() => scrollToBottom('smooth'), 100);
  
      await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/messages/send/${selectedConversation.receiver}`, {
        message: messageInput
      });
  
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg._id !== optimisticMessage._id)
      );
      setMessageInput(optimisticMessage.message);
    }
  };
  
  useEffect(() => {
    const messageContainer = messageRef.current;
  
    const handleScroll = async () => {
      if (!messageContainer) return;
  
      let isNearTop = messageContainer.scrollTop === 0;
  
      if (isNearTop && !loading && hasMore && selectedConversation) {
        const nextPage = page + 1;
        try {
          const previousScrollHeight = messageContainer.scrollHeight;
  
          await fetchMessages(selectedConversation.receiver, nextPage, false);
  
          const newScrollHeight = messageContainer.scrollHeight;
          const scrollHeightDifference = newScrollHeight - previousScrollHeight;
  
          messageContainer.scrollTop = scrollHeightDifference;
        } catch (error) {
          console.error('Error fetching older messages:', error);
        }
      }
    };
  
    if (messageContainer) {
      messageContainer.addEventListener('scroll', handleScroll);
      return () => {
        messageContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [selectedConversation, page, loading, hasMore]);

  useEffect(() => {
    if (!selectedConversation) {
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100); 
    }
  }, [selectedConversation, messages]);
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  return (
    <div className="flex max-w-screen h-full bg-gray-200 border-1 rounded-sm">
      {/* Conversations Sidebar */}
      <div className="w-96 h-full bg-white border-1 rounded-r-sm shadow-sm">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-blue-600" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal />
          </button>
        </div>

        <div className="p-3">
          <div className="flex items-center bg-gray-50 rounded-full px-3 py-2">
            <Search className="text-gray-400 mr-2" size={20} />
            <Input type="text" placeholder="Search conversations..." className="bg-transparent w-full focus:outline-none" />
          </div>
        </div>

        <div className="overflow-y-auto">
          {conversations.map(conversation => (
            <ConversationListItem
              key={conversation._id}
              id={conversation._id}
              name={conversation.name}
              profile={conversation.profile}
              isSelected={selectedConversation?._id === conversation._id}
              onClick={() => handleSelectConversation(conversation)}
            />
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className=" h-full flex-grow flex flex-col ">
        {selectedConversation ? (
          <>
            <ChatHeader name={selectedConversation.name} profile={selectedConversation.profile} onBack={() => setSelectedConversation(null)} />

            <div className="h-full flex-1 overflow-y-auto p-4 space-y-4 chat-container" ref={messageRef} >
              {loading 
              && page > 1 
              && <Spinner className='text-orange-500'><span className='text-orange-500 text-sm'>loading message....</span></Spinner>}
                   
              {!hasMore && (
                <div className="text-center text-gray-500 py-4">
                  No more messages
                </div>
              )}
              {messages.map(message => (
                <ChatMessage
                  key={message._id}
                  message={message.message}
                  timestamp={message.createdAt}
                  isCurrentUser={message.senderId === user?._id}
                  profile={selectedConversation.profile}
                />
              ))}
            </div>

            <ChatInput value={messageInput} onChange={setMessageInput} onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
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