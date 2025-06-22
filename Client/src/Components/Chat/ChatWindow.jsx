import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { getProfileImageUrl } from '../../utils/imageHelper';
import '../../Styles/Chat/ChatWindow.css';

const ChatWindow = () => {
  const { activeChat, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="chat-window-container empty">
        <div className="no-active-chat">
          <h3>No chat selected</h3>
          <p>Select a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = () => {
    return user?._id === activeChat.client._id ? activeChat.worker : activeChat.client;
  };

  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: [...currentGroup]
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: [...currentGroup]
      });
    }
    
    return groups;
  };

  const otherParticipant = getOtherParticipant();
  const messageGroups = groupMessagesByDate();
  const profileImageUrl = getProfileImageUrl(otherParticipant.profileImageUrl);

  return (
    <div className="chat-window-container">
      <div className="chat-window-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={otherParticipant.fullName} 
                className="user-profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.style.display = 'none';
                  if (e.target.parentNode.querySelector('.default-avatar')) {
                    e.target.parentNode.querySelector('.default-avatar').style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div 
              className="default-avatar" 
              style={{display: profileImageUrl ? 'none' : 'flex'}}
            >
              {otherParticipant.fullName?.charAt(0) || '?'}
            </div>
          </div>
          <div className="chat-user-details">
            <h3>{otherParticipant.fullName}</h3>
            <span className="chat-project-name">
              {activeChat.projectId?.title || "Project Chat"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        {messageGroups.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="message-group">
              <div className="message-date-divider">
                <span>{formatMessageDate(new Date(group.date))}</span>
              </div>
              
              {group.messages.map((message) => {
                const isMine = message.sender._id === user?._id;
                
                return (
                  <div 
                    key={message._id} 
                    className={`message-container ${isMine ? 'mine' : 'other'}`}
                  >
                    <div className={`message-bubble ${isMine ? 'sent' : 'received'}`}>
                      <div className="message-content">{message.content}</div>
                      <div className="message-time">
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;