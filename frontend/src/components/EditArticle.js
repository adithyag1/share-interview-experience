import React, { useState ,useEffect} from "react";
import { useNavigate , useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
import Navbar from "./Navbar";
axios.defaults.withCredentials = true;

const EditArticle = () => {
  const navigate = useNavigate();
  const [cookies,setCookie, removeCookie]=useCookies();
  const [username,setUsername]=useState();
  const [userId,setUserId]=useState();

  const [loading,setLoading]=useState(true);
  const {id}=useParams();
  const [institution, setInstitution] = useState("");
  const [onCampus, setOnCampus] = useState(true);
  const [payRange, setPayRange] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [article,setArticle] = useState(null);
  const institutions = ["Institution A", "Institution B", "Institution C"];
  const roles = ["Role A", "Role B", "Role C"];
  const companies = ["Company A", "Company B", "Company C"];

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth",
          {},
          { withCredentials: true }
        );
        const { status, username,_id } = data;
        if (!status) {
          removeCookie("token", { path: "/" });
          navigate("/");
        } else {
          setUsername(username);
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
    
  useEffect(()=>{
  const fetchArticle = async() => {
    try{
        const res=await axios.get(`http://localhost:5000/api/article/${id}`);
        if(res && res.data){
            setInstitution(res.data.institution);
            setCompany(res.data.company);
            setOnCampus(res.data.onCampus);
            setPayRange(res.data.payRange);
            setRole(res.data.role);
            setTitle(res.data.title);
            setContent(res.data.content);
            setLoading(false);
        }
        else{
            console.log('Article not found');
            setLoading(false);
        }
    }
    catch(err){
        console.log(err);
    } finally{
        setLoading(false);
    }
  }
  fetchArticle();
},[id,cookies,navigate,removeCookie,setCookie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user is ",userId);
    try {
      const newArticle = {
        author: userId, 
        institution,
        onCampus,
        payRange: Number(payRange),
        role,
        company,
        title,
        content,
        _id:id
      };

      await axios.post('http://localhost:5000/api/article/edit', newArticle);
      alert('Article updated successfully');
    } catch (error) {
      console.error("Error adding article:", error);
      alert('Error adding article. Please try again.');
    } 
  };

  return (
    <div>
      <div>
        <Navbar />
        { loading?(<div>Loading...</div>):
        (
            <div>
      <h2>Edit Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Institution:</label>
          <select value={institution} onChange={(e) => setInstitution(e.target.value)} required>
            <option value="">Select Institution</option>
            {institutions.map((inst, index) => (
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
        <button type="submit">Edit Article</button>
      </form>
      </div>)
}
      </div>
    </div>
  );
};

export default EditArticle;
