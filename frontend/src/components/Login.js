import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import "../App.css";

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
        console.log("Error in verifying cookie: ", err);
        removeCookie("token", { path: "/" });
      }
    };
    verifyCookie();
  }, [cookies, setCookie, navigate, removeCookie]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async (username, password) => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password },
        { withCredentials: true }
      );
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Server is down :(");
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div class="login">
      <form onSubmit={handleSubmit} class="login-form">
        <input
          class="login-input"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          class="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" class="submit">
          Login
        </button>
      </form>
      <div>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
