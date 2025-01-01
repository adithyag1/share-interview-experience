import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AddArticle from "./components/AddArticle";
import SearchArticles from "./components/SearchArticles";
import MyArticles from "./components/MyArticles";
import EditArticle from "./components/EditArticle";
import ShowArticle from "./components/ShowArticle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-article" element={<AddArticle />} />
        <Route path="/edit-article/:id" element={<EditArticle />} />
        <Route path="/my-articles" element={<MyArticles />} />
        <Route path="/search-articles" element={<SearchArticles />} />
        <Route path="/show-article/:id" element={<ShowArticle />} />
      </Routes>
    </Router>
  );
}

export default App;
