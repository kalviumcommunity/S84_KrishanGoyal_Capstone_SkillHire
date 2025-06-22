import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import ChatList from '../../Components/Chat/ChatList';
import ChatWindow from '../../Components/Chat/ChatWindow';
import NavbarDashboards from '../../Components/NavbarDashboards';
import '../../Styles/Chat/ChatPage.css';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { fetchChats, loadChat, setActiveChat } = useChat();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId, loadChat]);

  const handleSelectChat = (selectedChatId) => {
    navigate(`/chats/${selectedChatId}`);
  };

  const handleBackClick = () => {
    setActiveChat(null);
    navigate('/chats');
  };

  return (
    <div className="chat-page">
      <NavbarDashboards />
      <div className="chat-container">
        <div className={`chat-sidebar ${chatId ? 'hidden-mobile' : ''}`}>
          <h2>Messages</h2>
          <ChatList onSelectChat={handleSelectChat} />
        </div>
        
        <div className={`chat-main ${!chatId ? 'hidden-mobile' : ''}`}>
          {chatId ? (
            <div className="chat-main-content">
              <div className="back-button-container">
                <button className="back-button" onClick={handleBackClick}>
                  ← Back to chats
                </button>
              </div>
              <ChatWindow />
            </div>
          ) : (
            <div className="no-chat-selected">
              <h3>Select a conversation</h3>
              <p>Choose a chat from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;