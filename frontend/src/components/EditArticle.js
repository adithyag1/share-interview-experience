import React, { useState ,useEffect} from "react";
import { useNavigate , useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
import Navbar from "./Navbar";
axios.defaults.withCredentials = true;

const EditArticle = () => {
  const navigate = useNavigate();
  const [cookies,setCookie, removeCookie]=useCookies();
  const [userId,setUserId]=useState();

  const [loading,setLoading]=useState(true);
  const {id}=useParams();
  const [institute, setInstitute] = useState("");
  const [onCampus, setOnCampus] = useState(false);
  const [payRange, setPayRange] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const institutes = ["Institute A", "Institute B", "Institute C"];
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
        const { status,_id } = data;
        if (!status) {
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
    
  useEffect(()=>{
  const fetchArticle = async() => {
    try{
        const res=await axios.get(`http://localhost:5000/api/article/${id}`);
        if(res && res.data){
            setInstitute(res.data.institute);
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
        institute,
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
        <Navbar />
        { loading?(<div>Loading...</div>):
        (
            <div>
      <h2 class='form-heading'>Edit Article</h2>
      <form onSubmit={handleSubmit} class='article-form'>
        <div class='form-item'>
          <label class='article-form-label'>Institute:</label>
          <select class='article-form-select' value={institute} onChange={(e) => setInstitute(e.target.value)} required>
            <option value="">Select Institute</option>
            {institutes.map((inst, index) => (
              <option key={index} value={inst}>{inst}</option>
            ))}
          </select>
        </div>
        <div class='form-item'>
          <label class='article-form-label'>On Campus:</label>
          <select class='article-form-select' value={onCampus} onChange={(e) => setOnCampus(e.target.value === 'true')} required>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div class='form-item'>
          <label class='article-form-label'>Pay Range:</label>
          <input class='article-form-input' 
            type="number"
            value={payRange}
            onChange={(e) => setPayRange(e.target.value)}
            placeholder="Pay Range"
            required
          />
        </div>
        <div class='form-item'>
          <label class='article-form-label'>Role:</label>
          <select class='article-form-select' value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div class='form-item'>
          <label class='article-form-label'>Company:</label>
          <select class='article-form-select' value={company} onChange={(e) => setCompany(e.target.value)} required>
            <option value="">Select Company</option>
            {companies.map((comp, index) => (
              <option key={index} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
        <div class='form-item'>
            <label class='article-form-label'>Title:</label>
            <input class='article-form-input' type='text' value={title} required onChange={(e)=>setTitle(e.target.value)} placeholder="Title"/>
        </div>
        <div class='form-item'>
          <label class='article-form-label'>Content:</label>
          <textarea class='article-form-textarea'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here"
            required
          />
        </div>
        <button type="submit" class='article-form-submit cursor-pointer'>Edit Article</button>
      </form>
      </div>)
}
    </div>
  );
};

export default EditArticle;
