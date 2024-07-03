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

router.get('/search', async (req, res) => {
    const { institution, company, onCampus, minPay, maxPay, role } = req.query;

    try {
        const query = {};

        if (institution) query.institution = institution;
        if (company) query.company = company;
        if (onCampus !== undefined) query.onCampus =( onCampus === 'true');
        if (role) query.role = role;
        if (minPay !== undefined || maxPay !== undefined) {
            query.payRange = {};
            if (minPay !== undefined) query.payRange.$gte = Number(minPay);
            if (maxPay !== undefined) query.payRange.$lte = Number(maxPay);
        }

        const articles = await Article.find(query).populate('author', 'username');
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
