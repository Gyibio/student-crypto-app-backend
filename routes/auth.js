const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const bcrpyt = require('bcryptjs')

//Regiter (POST)
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    // 1. Generate a salt
    const salt = await bcrypt.genSalt(10);

    //Hash the password
    const hashedPassword = await bcrpyt.hash(password, salt);
    
    //3.Save the new user with the Hashed password
    const newUser = new User({name, email, password: hashedPassword})
    await newUser.save();
    res.status(201).json({message: 'User registered successfully'})
})

//Login (POST)
router.post('/login', async(req, res) => {
    try{
    //1. find user
    const user = await User.findOne ({emai: req.bpdy.email});
    if (!user) return res.status(400).send('Invalid email or password');

    //2.compare incoming password with stored hash
    const validPassword = await bcrpyt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    //3.create token
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);
    res.header('Authorization', token).json({token});
    }catch (err) {
        res.status(500).send('Server error')
    }
})

//Profile (Get) 
router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user)
})

module.exports = router;