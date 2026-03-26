import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Camera, X } from 'lucide-react';
import './ChatInput.css';

const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]); // array of base64 strings
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && images.length === 0) || isLoading) return;
    onSend(text.trim(), images);
    setText('');
    setImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    if (e.target.value) e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="chat-input-wrapper">
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="image-previews">
          {images.map((img, idx) => (
            <div key={idx} className="preview-container">
              <img src={img} alt="preview" className="preview-img" />
              <button 
                className="remove-img-btn" 
                onClick={() => removeImage(idx)}
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="input-box">
        <div className="attachment-buttons">
          <input 
            type="file" 
            accept="image/*" 
            multiple
            className="hidden-input" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button 
            className="action-btn" 
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
            disabled={isLoading}
          >
            <ImageIcon size={20} />
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden-input" 
            ref={cameraInputRef}
            onChange={handleFileChange}
          />
          <button 
            className="action-btn mobile-only" 
            onClick={() => cameraInputRef.current?.click()}
            title="Take Photo"
            disabled={isLoading}
          >
            <Camera size={20} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a medical coding question..."
          rows={1}
          disabled={isLoading}
        />

        <button 
          className={`send-btn ${text.trim() || images.length > 0 ? 'active' : ''}`}
          onClick={handleSend}
          disabled={(!text.trim() && images.length === 0) || isLoading}
        >
          <Send size={18} fill="currentColor" />
        </button>
      </div>
      <div className="disclaimer">
        Vanni can make mistakes. Consider verifying important information.
      </div>
    </div>
  );
};

export default ChatInput;
