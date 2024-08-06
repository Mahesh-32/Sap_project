import React, { useState } from 'react';
import { Client } from "@gradio/client";
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const client = await Client.connect("https://1644569c8d55255203.gradio.live/");
      const result = await client.predict("/chat", { user_question: input });

      // Extracting the text response from the array and formatting it
      const botMessageText = Array.isArray(result.data) && typeof result.data[0] === 'string' ? result.data[0] : JSON.stringify(result.data);
      const formattedBotMessage = botMessageText.replace(/\n/g, '<br>');
      const botMessage = { sender: 'bot', text: formattedBotMessage };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <header>
        <div className="logo">VENDOR AI</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
          <a href="#">FAQs</a>
          <button className="toggle-btn">🔮</button>
        </nav>
      </header>
      <main>
        <div className="chat-container">
          <h1>Chatbot</h1>
          <div className="chat-box" id="chat-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.sender === 'bot' ? (
                  <div dangerouslySetInnerHTML={{ __html: message.text }} />
                ) : (
                  message.text
                )}
              </div>
            ))}
          </div>
          <input 
            type="text" 
            id="user-input" 
            placeholder="Enter Your Query" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id="send-button" onClick={handleSend}>⬆️</button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
