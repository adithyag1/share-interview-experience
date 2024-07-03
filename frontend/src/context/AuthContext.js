import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            setAuth(response.data);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
                throw error;
            }
            else{
            alert('Error in logging in');
            throw error;
            }
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                username,
                email,
                password
            });
            return res.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('An unknown error occurred during registration');
        }
    };

    const logout = () => {
        setAuth(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ auth, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
