const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const articleRoutes= require('./routes/article')
const cors=require('cors');
const cookieParser=require('cookie-parser');
dotenv.config();

const app = express();
app.use(express.json());
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true
}
app.use(cors(corsOptions));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log("Error in connecting MongoDB", err));

app.use('/api/auth', authRoutes);
app.use('/api/articles',articleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
