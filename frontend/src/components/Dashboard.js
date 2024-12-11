import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import AddArticle from "./AddArticle";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth",
          {},
          { withCredentials: true }
        );
        console.log(data);
        const { status, username } = data;
        if (!status) {
          console.log("status false");
          removeCookie("token", { path: "/" });
          navigate("/");
        } else {
          setUsername(username);
        }
      } catch (err) {
        console.log(err);
        removeCookie("token", { path: "/" });
        navigate("/");
      }
    };
    verifyCookie();
  }, [cookies, setCookie, navigate, removeCookie]);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    removeCookie("token", { path: "/" });
    navigate("/");
  };
  return (
    <div>
      <div>
        <h1>Welcome, {username}!</h1>
        <Link to="/add-article">Add Your Experience</Link>
        <Link to="/search-articles">Search Experiences</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
