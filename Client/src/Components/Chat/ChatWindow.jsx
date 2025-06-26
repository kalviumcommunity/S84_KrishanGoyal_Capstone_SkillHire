import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { getProfileImageUrl } from '../../utils/imageHelper';
import PaymentNegotiationModal from '../PaymentNegotitationModal';
import axios from 'axios';
import '../../Styles/Chat/ChatWindow.css';

const ChatWindow = () => {
  const { activeChat, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (activeChat) {
      fetchProjectDetails();
    }
  }, [activeChat]);

  const fetchProjectDetails = async () => {
    if (!activeChat) return;
    
    try {
      const projectType = activeChat.projectType === 'ProProject' ? 'pro' : 'go';
      const response = await axios.get(
        `${baseUrl}/api/${projectType}-projects/${activeChat.projectId._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      
      setProjectDetails(response.data.project);
    } catch {
      // 
    }
  };

  const handleSubmitPayment = async ({ amount, notes }) => {
    try {
      const projectType = activeChat.projectType === 'ProProject' ? 'pro' : 'go';
      const endpoint = `${baseUrl}/api/${projectType}-projects/${activeChat.projectId._id}/set-payment`;
      
      await axios.put(
        endpoint,
        { amount, notes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      
      setShowPaymentModal(false);
      
      const isClient = user._id === activeChat.client._id;
      const messageText = isClient 
        ? `Final payment amount set: ₹${amount}${notes ? ` - Note: ${notes}` : ''}`
        : `Payment amount proposed: ₹${amount}${notes ? ` - Note: ${notes}` : ''}`;
        
      sendMessage(messageText);
      
      fetchProjectDetails();
      
    } catch {
      // 
    }
  };

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
  const isClient = user?._id === activeChat.client._id;
  
  const canNegotiatePayment = projectDetails && 
    (projectDetails.status === 'in-progress' || 
     projectDetails.status === 'assigned but not completed');

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
        
        {canNegotiatePayment && (
          <div className="chat-header-actions">
            {projectDetails?.payment ? (
              <div className="payment-info">
                <span>Payment: ₹{projectDetails.payment.toLocaleString()}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="set-payment-btn"
              >
                {isClient ? 'Set Payment' : 'Propose Payment'}
              </button>
            )}
          </div>
        )}
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
      
      <PaymentNegotiationModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handleSubmitPayment}
        initialAmount={projectDetails?.payment || ''}
        projectType={activeChat?.projectType}
        isClient={isClient}
      />
    </div>
  );
};

export default ChatWindow;