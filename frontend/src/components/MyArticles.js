import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const MyArticles = () =>{
    const [cookies,setCookie,removeCookie]=useCookies();
    const [username,setUsername]=useState('');
    const [userId,setUserId]=useState('');
    const [articles,setArticles]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();
    useEffect(()=>{
        const verifyCookie=async ()=>{
            try{
                const {data} = await axios.post(
                    'http://localhost:5000/api/auth/',
                    {},
                    {withCredentials:true}
                );
                const {status,_id,username}=data;
                if(!status){
                    console.log('status false');
                    removeCookie('token',{path:'/'});
                    navigate('/');
                }
                else{
                    console.log('status true');
                    setUsername(username);
                    setUserId(_id);
                    console.log('user id is',_id,":: ",userId);
                }
            }
            catch(err){
                console.log('caught ',err);
                removeCookie('token',{path:'/'});
                navigate('/');
            }
        }
        verifyCookie();
    },[cookies,setCookie,navigate,removeCookie]);

    useEffect(()=>{
    const getArticles=async()=>{
        console.log('before con user id',userId);
        try{
        const res=await axios.get(`http://localhost:5000/api/article/get-user-article/${userId}`);
        console.log(res.data);
        setArticles(res.data);
        setLoading(false);
        }catch(err){
            console.log('Error in fetching articles: ',err);
        } 
    };
    getArticles();
},[userId]);

const handleEdit=(_id)=>{
    //console.log("hi");
    navigate(`/edit-article/${_id}`);
};

    return (
        <div>
            <Navbar />
            <div>{username}</div>
            {
                loading? (<div>Loading...</div>):
                articles.length>0 ? 
                (<div>
                    {articles.map(article=>(
                        <li key={article._id}>
                            <h3>{article.title}</h3>
                            <p>{article.institution}</p>
                            <p>{article.onCampus ? "On Campus" : "Off Campus"}</p>
                            <p>{article.payRange}</p>
                            <p>{article.role}</p>
                            <p>{article.company}</p>
                            <p>{new Date(article.createdAt).toLocaleDateString()}</p>
                            <button onClick={()=>handleEdit(article._id)}>Edit</button>
                        </li>
                    ))}
                </div>)
                :
                (<div>
                    You have not added any experiences!
                </div>)
            }
        </div>
    );
};

export default MyArticles