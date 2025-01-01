import React, { useState ,useEffect} from "react";
import { useNavigate  } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
import Navbar from "./Navbar";
axios.defaults.withCredentials = true;

const AddArticle = () => {
  const navigate = useNavigate();
  const [cookies,setCookie, removeCookie]=useCookies();
  const [userId,setUserId]=useState();
  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth",
          {},
          { withCredentials: true }
        );
        console.log(data);
        const { status,_id } = data;
        if (!status) {
          console.log("status false");
          removeCookie("token", { path: "/" });
          navigate("/");
        } else {
          setUserId(_id);
        }
      } catch (err) {
        console.log(err);
        removeCookie("token", { path: "/" });
        navigate("/");
      }
    };
    verifyCookie();
  }, [cookies, setCookie, navigate, removeCookie]);
  
  
  const [institute, setInstitute] = useState("");
  const [onCampus, setOnCampus] = useState(true);
  const [payRange, setPayRange] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const institutes = ["Institute A", "Institute B", "Institute C"];
  const roles = ["Role A", "Role B", "Role C"];
  const companies = ["Company A", "Company B", "Company C"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user is ",userId);
    try {
      const newArticle = {
        author: userId, 
        institute,
        onCampus,
        payRange: Number(payRange),
        role,
        company,
        title,
        content,
      };

      await axios.post('http://localhost:5000/api/article/add', newArticle);
      alert('Article added successfully');
    } catch (error) {
      console.error("Error adding article:", error);
      alert('Error adding article. Please try again.');
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      <h2>Add Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Institute:</label>
          <select value={institute} onChange={(e) => setInstitute(e.target.value)} required>
            <option value="">Select Institute</option>
            {institutes.map((inst, index) => (
              <option key={index} value={inst}>{inst}</option>
            ))}
          </select>
        </div>
        <div>
          <label>On Campus:</label>
          <select value={onCampus} onChange={(e) => setOnCampus(e.target.value === 'true')} required>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label>Pay Range:</label>
          <input
            type="number"
            value={payRange}
            onChange={(e) => setPayRange(e.target.value)}
            placeholder="Pay Range"
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Company:</label>
          <select value={company} onChange={(e) => setCompany(e.target.value)} required>
            <option value="">Select Company</option>
            {companies.map((comp, index) => (
              <option key={index} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
        <div>
            <label>Title:</label>
            <input type='text' value={title} required onChange={(e)=>setTitle(e.target.value)} placeholder="Title"/>
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here"
            required
          />
        </div>
        <button type="submit">Add Article</button>
      </form>
      </div>
    </div>
  );
};

export default AddArticle;
