import React, { useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () =>{
    const navigate=useNavigate();
    const [removeCookie]=useCookies();
  const handleLogout = async () => {
    try{
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    removeCookie("token", { path: "/" });
    navigate("/");
  }
  catch(err){
    console.log(err);
    navigate("/");
}
  };
    return (
        <div>
            <div class='navbar'>
                <Link to='/dashboard' class='home'>Home</Link>
                <button onClick={handleLogout} class='logout'>Logout</button>
            </div>
        </div>
    )
}

export default Navbar;