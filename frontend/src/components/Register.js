import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import '../App.css'
const Register = () => {
    
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();
    useEffect(() => {
      const verifyCookie = async () => {
        try {
          const { data } = await axios.post(
            "http://localhost:5000/api/auth",
            {},
            { withCredentials: true }
          );
          console.log(data);
          const { status } = data;
          if (status) {
            console.log("already logged in");
            navigate("/dashboard");
          }
        } catch (err) {
          console.log("Error in verifying cookie: ",err);
          removeCookie("token", { path: "/" });
        }
      };
      verifyCookie();
    }, [cookies, setCookie, navigate, removeCookie]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            alert('Registration successful');
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div class='login'>
            <form onSubmit={handleSubmit} class='login-form'>
                <input class='login-input'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input class='login-input'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input class='login-input'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" class='submit'>Register</button>
            </form>
            <div>
                Already have an account? <Link to='/'>Login</Link>
            </div>
        </div>
    );
};

export default Register;
