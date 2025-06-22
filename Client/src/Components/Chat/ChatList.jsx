import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { getProfileImageUrl } from '../../utils/imageHelper';
import '../../Styles/Chat/ChatList.css';

const ChatList = ({ onSelectChat }) => {
  const { chats, activeChat, loading } = useChat();
  const { user } = useAuth();

  if (loading) {
    return <div className="chat-list-loading">Loading chats...</div>;
  }

  const getOtherParticipant = (chat) => {
    return user?._id === chat.client._id ? chat.worker : chat.client;
  };

  const getUnreadCount = (chat) => {
    return chat.unreadCount && chat.unreadCount[user?._id] ? chat.unreadCount[user?._id] : 0;
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const messageDate = new Date(timestamp);
    const today = new Date();
    
    // If message is from today, return time
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If message is from yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise return date
    return messageDate.toLocaleDateString();
  };

  const getLastMessageContent = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    return chat.lastMessage.content;
  };

  if (chats.length === 0) {
    return (
      <div className="chat-list-empty">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      {chats.map((chat) => {
        const otherUser = getOtherParticipant(chat);
        const unreadCount = getUnreadCount(chat);
        const isActive = activeChat && activeChat._id === chat._id;
        const profileImage = getProfileImageUrl(otherUser.profileImageUrl);

        return (
          <div 
            key={chat._id} 
            className={`chat-list-item ${isActive ? 'active' : ''} ${unreadCount > 0 ? 'unread' : ''}`}
            onClick={() => onSelectChat(chat._id)}
          >
            <div className="chat-list-avatar">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={otherUser.fullName} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    if (e.target.parentNode.querySelector('.default-avatar')) {
                      e.target.parentNode.querySelector('.default-avatar').style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="default-avatar" 
                style={{display: profileImage ? 'none' : 'flex'}}
              >
                {otherUser.fullName?.charAt(0) || '?'}
              </div>
            </div>
            <div className="chat-list-details">
              <div className="chat-list-header">
                <span className="chat-list-name">{otherUser.fullName}</span>
                <span className="chat-list-time">
                  {formatLastMessageTime(chat.lastMessage?.timestamp)}
                </span>
              </div>
              <div className="chat-list-message">
                <p>{getLastMessageContent(chat)}</p>
                {unreadCount > 0 && (
                  <span className="unread-badge">{unreadCount}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;