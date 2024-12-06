import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
        await login(username, password);
        navigate('/dashboard');
        }
        catch(err){
            alert('oopsie daisy');
            console.log('Error: ',err);
        }
    };

    return (
        <div class='login'>
            <form onSubmit={handleSubmit} class='login-form'>
                <input class='login-input'
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input class='login-input'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" class='submit'>Login</button>
            </form>
            <div>
                Don't have an account? <Link to='/register'>Register</Link>
            </div>
        </div>
    );
};

export default Login;
