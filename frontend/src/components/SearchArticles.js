import React, { useState } from "react";
import axios from "axios";

const SearchArticles = () => {
    const [institution, setInstitution] = useState("");
    const [company, setCompany] = useState("");
    const [onCampus, setOnCampus] = useState("");
    const [minPay, setMinPay] = useState("");
    const [maxPay, setMaxPay] = useState("");
    const [role, setRole] = useState("");
    const [articles, setArticles] = useState([]);

    const institutions = ["Institution A", "Institution B", "Institution C"];
    const roles = ["Role A", "Role B", "Role C"];
    const companies = ["Company A", "Company B", "Company C"];

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/api/articles/search', {
                params: {
                    institution,
                    company,
                    onCampus,
                    minPay,
                    maxPay,
                    role,
                }
            });
            setArticles(response.data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <select value={institution} onChange={(e) => setInstitution(e.target.value)}>
                    <option value="">All Institutions</option>
                    {institutions.map((inst) => (
                        <option key={inst} value={inst}>{inst}</option>
                    ))}
                </select>
                <select value={company} onChange={(e) => setCompany(e.target.value)}>
                    <option value="">All Companies</option>
                    {companies.map((comp) => (
                        <option key={comp} value={comp}>{comp}</option>
                    ))}
                </select>
                <select value={onCampus} onChange={(e) => setOnCampus(e.target.value)}>
                    <option value="">Both On-Campus and Off-Campus</option>
                    <option value="true">On-Campus</option>
                    <option value="false">Off-Campus</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Pay"
                    value={minPay}
                    onChange={(e) => setMinPay(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Pay"
                    value={maxPay}
                    onChange={(e) => setMaxPay(e.target.value)}
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">All Roles</option>
                    {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                <button type="submit">Search</button>
            </form>
            <div>
                {articles.map(article => (
                    <div key={article._id}>
                        <h2>{article.title}</h2>
                        <p>{article.content}</p>
                        <p>Author: {article.author.username}</p>
                        <p>Institution: {article.institution}</p>
                        <p>Company: {article.company}</p>
                        <p>Role: {article.role}</p>
                        <p>Pay: {article.payRange}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchArticles;
