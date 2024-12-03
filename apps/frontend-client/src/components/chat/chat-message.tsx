import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';

interface Message {
  _id: string;
  senderId: string;
  message: string;
  createdAt: string;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUser: string;
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUser,
  isLoading,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (viewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
      console.log(`Scroll position: ${scrollTop}`);
      console.log(`Scroll height: ${scrollHeight}`);
      console.log(`Client height: ${clientHeight}`);
    }
  };

  return (
    <ScrollArea 
      className="flex-1 p-4"
      ref={viewportRef}
      onScrollCapture={handleScroll}
    >
      {isLoading && (
        <div className="text-center py-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-r-transparent" />
        </div>
      )}
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message._id}
            message={message.message}
            timestamp={message.createdAt}
            isCurrentUser={currentUser === message.senderId}
          />
        ))}
      </div>
    </ScrollArea>
  );
};