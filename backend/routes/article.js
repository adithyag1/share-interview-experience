const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');
const ObjectId=mongoose.Types.ObjectId;

router.post('/add', async (req, res) => {
    const { author, institute, onCampus, payRange, role, company,title, content } = req.body;

    try {
        const newArticle = new Article({
            author,
            institute,
            onCampus,
            payRange,
            role,
            company,
            title,
            content,
            createdAt: new Date()
        });

        const savedArticle = await newArticle.save();
        
        await User.updateOne({_id:author},{$push:{articles:savedArticle._id}});

        res.status(201).json(savedArticle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

router.post('/edit', async(req,res)=>{
    try{
    const {_id,institute,company,onCampus,payRange,role,title,content}=req.body;
    const articleId=ObjectId.createFromHexString(_id);
    await Article.updateOne({_id:articleId},{$set:{institute,company,onCampus,payRange,role,title,content}});   
    User.updateOne(); 
        res.status(201).json({message:'updatd successfully'});
}
    catch(err){
        res.status(500).json({err});
    }
}
);

router.post('/search', async (req, res) => {
    const { institute, company, onCampus, payRangeLower, payRangeUpper, role } = req.body;

    const query = {};
    if (institute) query.institute = institute;
    if (company) query.company = company;
    if (onCampus !== undefined) query.onCampus = onCampus; // Backend expects a Boolean now
    if (payRangeLower !== undefined && payRangeUpper !== undefined) query.payRange = { $gte: payRangeLower, $lte: payRangeUpper };
    if (role) query.role = role;

    try {
        const articles = await Article.find(query, 'title institute onCampus payRange role company createdAt author').populate('author', 'username');
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/get-user-article/:id',async(req,res)=>{
    try{
        const article=await Article.find({author:req.params.id});
        res.status(200).json(article); 
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.delete('/delete/:id',async(req,res)=>{
    try{
        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Deleted successfully"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

module.exports = router;

