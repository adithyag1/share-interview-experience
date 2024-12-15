import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies} from 'react-cookie';
import Navbar from './Navbar';

axios.defaults.withCredentials = true;

const SearchArticles = () => {

    const navigate=useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();
    const [username,setUsername]=useState("");
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
  
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const [institution, setInstitution] = useState("");
    const [onCampus, setOnCampus] = useState(""); // Keep it as an empty string initially
    const [payRangeLower, setPayRangeLower] = useState("");
    const [payRangeUpper, setPayRangeUpper] = useState("");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");

    const institutions = ["Institution A", "Institution B", "Institution C"];
    const roles = ["Role A", "Role B", "Role C"];
    const companies = ["Company A", "Company B", "Company C"];

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const query = {};

            if (institution) query.institution = institution;
            if (onCampus !== "") query.onCampus = onCampus === "true"; // Convert string to Boolean
            if (payRangeLower) query.payRangeLower = Number(payRangeLower);
            if (payRangeUpper) query.payRangeUpper = Number(payRangeUpper);
            if (role) query.role = role;
            if (company) query.company = company;

            const response = await axios.post('http://localhost:5000/api/article/search', query);
            setArticles(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const fetchArticleContent = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/article/${id}`);
            setSelectedArticle(response.data);
        } catch (error) {
            console.error('Error fetching article content:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <form onSubmit={handleSearch}>
                <select value={institution} onChange={(e) => setInstitution(e.target.value)}>
                    <option value="">Any Institution</option>
                    {institutions.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                </select>
                <select value={onCampus} onChange={(e) => setOnCampus(e.target.value)}>
                    <option value="">Any Location</option>
                    <option value="true">On Campus</option>
                    <option value="false">Off Campus</option>
                </select>
                <input
                    type="number"
                    value={payRangeLower}
                    onChange={(e) => setPayRangeLower(e.target.value)}
                    placeholder="Pay Range Lower"
                />
                <input
                    type="number"
                    value={payRangeUpper}
                    onChange={(e) => setPayRangeUpper(e.target.value)}
                    placeholder="Pay Range Upper"
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Any Role</option>
                    {roles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <select value={company} onChange={(e) => setCompany(e.target.value)}>
                    <option value="">Any Company</option>
                    {companies.map(comp => <option key={comp} value={comp}>{comp}</option>)}
                </select>
                <button type="submit">Search</button>
            </form>

            {articles.length > 0 && (
                <ul>
                    {articles.map(article => (
                        <li key={article._id} onClick={() => fetchArticleContent(article._id)}>
                            <h3>{article.title}</h3>
                            <p>{article.institution}</p>
                            <p>{article.onCampus ? "On Campus" : "Off Campus"}</p>
                            <p>{article.payRange}</p>
                            <p>{article.role}</p>
                            <p>{article.company}</p>
                            <p>{new Date(article.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}

            {selectedArticle && (
                <div>
                    <h2>{selectedArticle.title}</h2>
                    <p>{selectedArticle.content}</p>
                </div>
            )}
        </div>
    );
};

export default SearchArticles;
