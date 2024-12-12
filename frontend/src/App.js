import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddArticle from './components/AddArticle';
import SearchArticles from './components/SearchArticles';
import MyArticles from './components/MyArticles';

function App() {
    return (
      <AuthProvider>
        <Router>
            <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-article" element={<AddArticle />} />
                    <Route path='/my-articles' element={<MyArticles />} />
                    <Route path="/search-articles" element={<SearchArticles />}/>
            </Routes>
        </Router>
      </AuthProvider>
    );
}

export default App;
