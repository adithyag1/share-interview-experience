const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

router.post('/add', async (req, res) => {
    const { author, institution, onCampus, payRange, role, company,title, content } = req.body;

    try {
        const newArticle = new Article({
            author,
            institution,
            onCampus,
            payRange,
            role,
            company,
            title,
            content,
            createdAt: new Date()
        });

        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// backend/routes/article.js

router.post('/search', async (req, res) => {
    const { institution, company, onCampus, payRangeLower, payRangeUpper, role } = req.body;

    const query = {};
    if (institution) query.institution = institution;
    if (company) query.company = company;
    if (onCampus !== undefined) query.onCampus = onCampus; // Backend expects a Boolean now
    if (payRangeLower !== undefined && payRangeUpper !== undefined) query.payRange = { $gte: payRangeLower, $lte: payRangeUpper };
    if (role) query.role = role;

    try {
        const articles = await Article.find(query, 'title institution onCampus payRange role company createdAt author').populate('author', 'username');
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

module.exports = router;

