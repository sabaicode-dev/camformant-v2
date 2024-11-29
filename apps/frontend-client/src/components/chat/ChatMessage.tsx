"use client";

interface ChatMessageProps {
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export function ChatMessage({ message, timestamp, isCurrentUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isCurrentUser ?'justify-start' : 'justify-end'}`}>
      <div 
        className={`
          max-w-[50%] p-3 rounded-2xl
          ${isCurrentUser 
            ?'bg-gray-100 text-gray-900 border border-gray-100'
            :'bg-orange-500 text-white'}
          transform transition-all duration-200 hover:scale-[1.02]
        `}
      >
        {message}
        <div className={`
          text-xs mt-1 
          ${isCurrentUser ? 'text-orange-100' : 'text-gray-300'}
        `}>
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}