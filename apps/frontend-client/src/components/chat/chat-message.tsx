import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessageScroll } from '@/hooks/useMessageScroll';
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
  onLoadMore: () => Promise<void>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUser,
  isLoading,
  onLoadMore,
}) => {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { handleScroll, scrollToBottom } = useMessageScroll({
    messages,
    isLoading,
    onLoadMore,
  });

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    const scrollViewport = scrollViewportRef.current;
    if (scrollViewport) {
      scrollToBottom(scrollViewportRef.current);
      console.log(scrollViewport.scrollTop);
    }
  }, [messages.length, scrollToBottom,scrollViewportRef]);

  return (
    <ScrollArea 
      className="flex-1 p-4"
      ref={scrollViewportRef}
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
            isCurrentUser={message.senderId === currentUser}
          />
        ))}
      </div>
    </ScrollArea>
  );
};