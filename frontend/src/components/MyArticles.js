import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const MyArticles = () =>{
    const [cookies,setCookie,removeCookie]=useCookies();
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
                const {status,_id}=data;
                if(!status){
                    removeCookie('token',{path:'/'});
                    navigate('/');
                }
                else{
                    setUserId(_id);
                }
            }
            catch(err){
                removeCookie('token',{path:'/'});
                navigate('/');
            }
        }
        verifyCookie();
    },[cookies,setCookie,navigate,removeCookie]);

    useEffect(()=>{
    const getArticles=async()=>{
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
            {
                loading? (<div>Loading...</div>):
                articles.length>0 ? 
                (<div>
                    {articles.map(article=>(
                        <div class='article' key={article._id} onClick={()=>handleEdit(article._id)}>
                            <h3><u>{article.title}</u></h3>
                                <div class='about-article'>
                                <p>{article.institute}</p>
                                <p>{article.onCampus ? "On Campus" : "Off Campus"}</p>
                                <p>{article.payRange}</p>
                                <p>{article.role}</p>
                                <p>{article.company}</p>
                                <p>{new Date(article.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
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