import React, { useState, useEffect } from 'react';
import ChatFeed from './components/ChatFeed';
import ChatInput from './components/ChatInput';
import { Bot, Settings, X, Stethoscope, MessageSquare } from 'lucide-react';
import { getOpenAIResponse } from './services/openai';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('medical');
  
  const [medicalMessages, setMedicalMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am Vanni, your medical coding assistant. How can I help you today? You can type a question or upload a medical document/image for analysis.'
    }
  ]);

  const [generalMessages, setGeneralMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I am Vanni, your general AI assistant. Ask me anything, or upload an image and I will help you out!'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from local storage or environment on mount
  useEffect(() => {
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    const storedKey = localStorage.getItem('openai_api_key');
    if (envKey) {
      setApiKey(envKey);
    } else if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const saveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('openai_api_key', apiKey);
    setShowSettings(false);
  };

  const handleSendMessage = async (text, images) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      images: images
    };
    
    // Choose which state to update based on active tab
    const currentMessages = activeTab === 'medical' ? medicalMessages : generalMessages;
    const pushMessage = activeTab === 'medical' ? setMedicalMessages : setGeneralMessages;
    
    // We only send messages without the React-specific 'id' field to OpenAI
    const conversationHistory = [...currentMessages, newUserMsg].map(({ role, content, images }) => ({ role, content, images }));
    
    const assistantId = Date.now() + 1;

    // Immediately push user message and an empty placeholder for the incoming AI stream
    pushMessage(prev => [
      ...prev, 
      newUserMsg,
      { id: assistantId, role: 'assistant', content: '' }
    ]);
    
    setIsLoading(true);

    try {
      await getOpenAIResponse(conversationHistory, apiKey, activeTab, (chunk) => {
        setIsLoading(false); // Hide the loading spinner as soon as the first word trickles in
        pushMessage(prev => prev.map(msg => 
          msg.id === assistantId 
            ? { ...msg, content: msg.content + chunk } 
            : msg
        ));
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Ensure spinner hides on error
      pushMessage(prev => prev.map(msg => 
        msg.id === assistantId 
          ? { ...msg, content: `**Error:** ${error.message}` } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const currentMessagesToDisplay = activeTab === 'medical' ? medicalMessages : generalMessages;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-logo">
          <Bot size={28} className="logo-icon" />
          <h1>Vanni</h1>
        </div>

        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            <Stethoscope size={16} /> Medical
          </button>
          <button 
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <MessageSquare size={16} /> General
          </button>
        </div>

        <button className="settings-btn" aria-label="Settings" onClick={() => setShowSettings(true)}>
          <Settings size={20} />
        </button>
      </header>

      <main className="chat-container">
        <ChatFeed messages={currentMessagesToDisplay} isLoading={isLoading} />
      </main>

      <footer className="input-container">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </footer>

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveApiKey}>
              <div className="form-group">
                <label htmlFor="apiKey">OpenAI API Key</label>
                <input 
                  type="password" 
                  id="apiKey" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="sk-..."
                  autoComplete="off"
                />
                <p className="help-text">Your API key is stored locally in your browser and never sent anywhere except directly to OpenAI.</p>
              </div>
              <button type="submit" className="save-btn">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
