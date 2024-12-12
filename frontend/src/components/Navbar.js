import React from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () =>{
    const navigate=useNavigate();
    const [removeCookie]=useCookies();
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
                <Link to='/dashboard'>Home</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Navbar;