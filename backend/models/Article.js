const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    onCampus: {
        type: Boolean,
        required: true
    },
    payRange: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
