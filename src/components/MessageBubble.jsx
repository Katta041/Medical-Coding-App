import React from 'react';
import Markdown from 'markdown-to-jsx';
import { User, Bot } from 'lucide-react';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-wrapper ${isUser ? 'user-wrapper' : 'bot-wrapper'}`}>
      <div className={`message-container ${isUser ? 'user' : 'bot'}`}>
        {!isUser && (
          <div className="avatar bot-avatar">
            <Bot size={20} />
          </div>
        )}
        
        <div className="message-content">
          {message.images && message.images.length > 0 && (
            <div className="message-images">
              {message.images.map((img, idx) => (
                <img key={idx} src={img} alt="attachment" className="attached-img" />
              ))}
            </div>
          )}
          
          <div className="message-text">
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <Markdown>{message.content}</Markdown>
            )}
          </div>
        </div>

        {isUser && (
          <div className="avatar user-avatar">
            <User size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
