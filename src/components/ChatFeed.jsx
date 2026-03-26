import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import './ChatFeed.css';

const ChatFeed = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-feed">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      
      {isLoading && (
        <div className="loading-bubble">
          <div className="dot-typing"></div>
        </div>
      )}
      <div ref={bottomRef} className="scroll-anchor" />
    </div>
  );
};

export default ChatFeed;
