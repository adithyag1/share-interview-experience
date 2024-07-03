import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [user,setUser]=useState(null);
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            setAuth(response.data);
            setUser(response.data.user);
        } catch (error) {
            if(error.response && error.response.data){
                throw new Error(error.response.data.message);
            }
            console.error('Login error', error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                username,
                email,
                password
            });
            setUser(res.data.user);
            localStorage.setItem('token',res.data.token);
            return res.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('An unknown error occurred during registration');
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};
