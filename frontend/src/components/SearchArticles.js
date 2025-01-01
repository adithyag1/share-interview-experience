import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";

axios.defaults.withCredentials = true;

const SearchArticles = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth",
          {},
          { withCredentials: true }
        );
        console.log(data);
        const { status } = data;
        if (!status) {
          console.log("status false");
          removeCookie("token", { path: "/" });
          navigate("/");
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
  const [institute, setInstitute] = useState("");
  const [onCampus, setOnCampus] = useState("");
  const [payRangeLower, setPayRangeLower] = useState("");
  const [payRangeUpper, setPayRangeUpper] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [loading,setLoading]=useState(true);

  const institutes = ["Institute A", "Institute B", "Institute C"];
  const roles = ["Role A", "Role B", "Role C"];
  const companies = ["Company A", "Company B", "Company C"];

  useEffect(() => {
    const prefillSearch = () => {
        try{
      const articles = JSON.parse(
        sessionStorage.getItem("search-articles-form-results")
      );
      const formData = JSON.parse(
        sessionStorage.getItem("search-articles-form-data")
      );
      if (articles) {
        setArticles(articles);
      }
      if (formData) {
        const {
          institute,
          payRangeLower,
          payRangeUpper,
          onCampus,
          company,
          role,
        } = formData;
        if (institute) {
          setInstitute(institute);
        }
        if (payRangeLower) {
          setPayRangeLower(payRangeLower);
        }
        if (payRangeUpper) {
          setPayRangeUpper(payRangeUpper);
        }
        if (onCampus) {
          setOnCampus(onCampus);
        }
        if (role) {
          setRole(role);
        }
        if (company) {
          setCompany(company);
        }
      }
    }catch(err){
        console.log(err);
    }finally{
      setLoading(false);
    }
    };
    prefillSearch();
  }, [cookies,navigate,setCookie,removeCookie]);


  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const query = {};

      if (institute) query.institute = institute;
      if (onCampus !== "") query.onCampus = onCampus === "true"; // Convert string to Boolean
      if (payRangeLower) query.payRangeLower = Number(payRangeLower);
      if (payRangeUpper) query.payRangeUpper = Number(payRangeUpper);
      if (role) query.role = role;
      if (company) query.company = company;

      const response = await axios.post(
        "http://localhost:5000/api/article/search",
        query
      );
      setArticles(response.data);
      sessionStorage.setItem(
        "search-articles-form-data",
        JSON.stringify({
          institute,
          onCampus,
          payRangeLower,
          payRangeUpper,
          role,
          company,
        })
      );
      sessionStorage.setItem(
        "search-articles-form-results",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleClearFilter = (e) => {
    setLoading(true);
    e.preventDefault();
    setArticles([]);
    setInstitute("");
    setPayRangeLower("");
    setPayRangeUpper("");
    setRole("");
    setCompany("");
    setOnCampus("");
    sessionStorage.removeItem("search-articles-form-data");
    sessionStorage.removeItem("search-articles-form-results");
    setLoading(false);
  };

  const showArticleContent = async (id) => {
    try {
      navigate(`/show-article/${id}`);
    } catch (err) {
      console.log("error in opening full article");
    }
  };

  return (
    <div>
      <Navbar />
      {loading?(<div>Loading</div>):(
        <div>
      <form onSubmit={handleSearch}>
        <select
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
        >
          <option value="">Any Institute</option>
          {institutes.map((inst) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
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
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <select value={company} onChange={(e) => setCompany(e.target.value)}>
          <option value="">Any Company</option>
          {companies.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
        <button onClick={(e) => handleClearFilter(e)}>Clear</button>
      </form>

      {articles.length > 0 && (
        <div>
          {articles.map((article) => (
            <div
              class="article"
              key={article._id}
              onClick={() => showArticleContent(article._id)}
            >
              <h3>
                <u>{article.title}</u>
              </h3>
              <div class="about-article">
                <p>{article.institute}</p>
                <p>{article.onCampus ? "On Campus" : "Off Campus"}</p>
                <p>{article.payRange}</p>
                <p>{article.role}</p>
                <p>{article.company}</p>
                <p>{new Date(article.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    )}
    </div>
  );
};

export default SearchArticles;
