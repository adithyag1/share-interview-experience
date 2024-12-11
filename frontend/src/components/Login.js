import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import '../App.css';

const Login = () => {
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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
        await login(username, password);
        navigate('/dashboard');
        }
        catch(err){
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
