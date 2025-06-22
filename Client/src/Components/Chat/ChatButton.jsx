import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import '../../Styles/Chat/ChatButton.css';

const ChatButton = ({ projectId, projectType, workerId, workerName }) => {
  const navigate = useNavigate();
  const { initializeChat, loading } = useChat();

  const handleChatInitiation = async () => {
    try {
      const chat = await initializeChat(projectId, projectType, workerId);
      navigate(`/chats/${chat._id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  return (
    <button 
      className="chat-button"
      onClick={handleChatInitiation}
      disabled={loading}
    >
      {loading ? 'Starting chat...' : `Message ${workerName}`}
    </button>
  );
};

export default ChatButton;