import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user,logout } = useContext(AuthContext);
    const navigate=useNavigate();
    const handleLogout = () =>{
        logout();
        navigate('/');
    }
    return (
        <div>
            {user ? (<div>
                <h1>Welcome, {user.username}!</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>):(<div><Link to='/'>You must login first!</Link> </div>)}
        </div>
    );
};

export default Dashboard;
