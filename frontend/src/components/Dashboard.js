import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';
import AddArticle from './AddArticle';

const Dashboard = () => {
    const { user,logout } = useContext(AuthContext);
    const navigate=useNavigate();
    const handleLogout = () =>{
        logout();
        navigate('/');
    }
    return (
        <div>
            {user ? 
            (<div>
                <h1>Welcome, {user.username}!</h1>
                <Link to='/add-article'>Add Your Experience</Link>
                <Link to='/search-articles'>Search Experiences</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>):
            (<div><Link to='/'>You must login first!</Link> </div>)
            }
        </div>
    );
};

export default Dashboard;
