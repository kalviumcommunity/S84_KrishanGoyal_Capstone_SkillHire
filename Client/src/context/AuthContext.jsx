import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('authToken');
                
                if (token) {
                    const response = await axios.get(`${baseUrl}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    });
                    
                    if (response.data.user) {
                        const userData = response.data.user;
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        setUser(null);
                        localStorage.removeItem('user');
                    }
                } else {
                    setUser(null);
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error(error)
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (userData, token) => {
        if (!token) {
            return;
        }

        try {
            localStorage.setItem('authToken', token);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            
            const response = await axios.get(`${baseUrl}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            
            if (!response.data.user) {
                throw new Error('Login verification failed - no user data returned');
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${baseUrl}/api/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            sessionStorage.clear();
        }
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 