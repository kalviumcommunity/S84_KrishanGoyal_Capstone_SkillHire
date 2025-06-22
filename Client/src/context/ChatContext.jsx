import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (user && user._id) {
      const token = localStorage.getItem('authToken');
      const newSocket = io(baseUrl, {
        auth: { token },
        withCredentials: true
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, baseUrl]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (message) => {
      if (activeChat && message.chatId === activeChat._id) {
        setMessages((prev) => [...prev, message]);
        socket.emit('mark-read', { chatId: activeChat._id });
      }

      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === message.chatId) {
            if (message.sender._id !== user._id) {
              const isClient = chat.client._id === user._id;
              return {
                ...chat,
                lastMessage: {
                  content: message.content,
                  sender: message.sender,
                  timestamp: message.createdAt
                },
                unreadClient: isClient ? chat.unreadClient + 1 : chat.unreadClient,
                unreadWorker: !isClient ? chat.unreadWorker + 1 : chat.unreadWorker
              };
            }
            return {
              ...chat,
              lastMessage: {
                content: message.content,
                sender: message.sender,
                timestamp: message.createdAt
              }
            };
          }
          return chat;
        });
      });
    });

    socket.on('update-chat-list', (updatedChat) => {
      setChats(prevChats => {
        const chatExists = prevChats.some(chat => chat._id === updatedChat._id);
        
        if (chatExists) {
          return prevChats.map(chat => 
            chat._id === updatedChat._id ? updatedChat : chat
          );
        } else {
          return [updatedChat, ...prevChats];
        }
      });
    });

    socket.on('messages-read', ({ chatId }) => {
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === chatId) {
            const isClient = chat.client._id === user._id;
            return {
              ...chat,
              unreadClient: isClient ? 0 : chat.unreadClient,
              unreadWorker: !isClient ? 0 : chat.unreadWorker
            };
          }
          return chat;
        });
      });
    });

    return () => {
      socket.off('receive-message');
      socket.off('update-chat-list');
      socket.off('messages-read');
    };
  }, [socket, activeChat, user]);

  useEffect(() => {
    if (user && chats.length > 0) {
      const isClient = user.role === 'client';
      const total = chats.reduce((acc, chat) => {
        return acc + (isClient ? chat.unreadClient : chat.unreadWorker);
      }, 0);
      setUnreadCount(total);
    } else {
      setUnreadCount(0);
    }
  }, [chats, user]);

  const fetchChats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseUrl}/api/chats/user-chats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      });
      
      setChats(response.data.chats);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [baseUrl, user]);

  const initializeChat = useCallback(async (projectId, projectType, workerId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${baseUrl}/api/chats/initialize`, {
        projectId,
        projectType,
        workerId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      });
      
      await fetchChats();
      
      return response.data.chat;
    } catch (err) {
      console.error('Error initializing chat:', err);
      setError(err.response?.data?.error || 'Failed to start chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, fetchChats]);

  const loadChat = useCallback(async (chatId) => {
    if (!socket) return;
    
    try {
      setLoading(true);
      setError(null);
      
      socket.emit('join-chat', chatId);
      
      const chatResponse = await axios.get(`${baseUrl}/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      });
      
      setActiveChat(chatResponse.data.chat);
      
      const messagesResponse = await axios.get(`${baseUrl}/api/chats/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      });
      
      setMessages(messagesResponse.data.messages);
      
      socket.emit('mark-read', { chatId });
      
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === chatId) {
            const isClient = chat.client._id === user._id;
            return {
              ...chat,
              unreadClient: isClient ? 0 : chat.unreadClient,
              unreadWorker: !isClient ? 0 : chat.unreadWorker
            };
          }
          return chat;
        });
      });
    } catch (err) {
      console.error('Error loading chat:', err);
      setError('Failed to load chat');
    } finally {
      setLoading(false);
    }
  }, [baseUrl, socket, user]);

  const sendMessage = useCallback(async (content) => {
    if (!socket || !activeChat) return;
    
    try {
      socket.emit('send-message', {
        chatId: activeChat._id,
        content
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  }, [socket, activeChat]);

  const value = {
    chats,
    activeChat,
    messages,
    loading,
    error,
    unreadCount,
    fetchChats,
    initializeChat,
    loadChat,
    sendMessage,
    setActiveChat
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};