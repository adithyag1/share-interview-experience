import React, { createContext, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const {data} = await axios.post('http://localhost:5000/api/auth/login', { username, password },{withCredentials:true});
            console.log(data);
            const {success,message} = data;
            console.log("success is ",success);
            console.log(message);
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
                throw error;
            }
            else{
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
