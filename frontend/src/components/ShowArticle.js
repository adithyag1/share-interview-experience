import React, { useState } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import axios from 'axios';

const ShowArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchArticleContent = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/article/${id}`
      );
      setArticle(response.data);
    } catch (error) {
      console.error("Error fetching article content:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchArticleContent(id);
  return (
    <>
      <Navbar />
      {loading ? (
        <div>Fetching your article...</div>
      ) : article ? (
        <div class="article-container">
          <div class="article-title">{article.title}</div>
          <div class="about-article">
            <p>{article.institute}</p>
            <p>{article.onCampus ? "On Campus" : "Off Campus"}</p>
            <p>{article.payRange}</p>
            <p>{article.role}</p>
            <p>{article.company}</p>
            <p>{new Date(article.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="article-content">
            <p>{article.content}</p>
          </div>
        </div>
      ) : (
        <div>Article Not FOund</div>
      )}
    </>
  );
};

export default ShowArticle;
