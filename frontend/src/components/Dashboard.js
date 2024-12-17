import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";
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
  return (
    <div>
      <div>
        <Navbar />
        <h1 class='welcome'>Welcome, {username}!</h1>
        <div class='links'>
        <Link to="/add-article" class='link'>Add Your Experience</Link>
        <Link to="/search-articles" class='link'>Search Experiences</Link>
        <Link to='/my-articles' class='link'>My Articles</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
