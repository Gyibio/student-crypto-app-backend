const express = require('express');
const router = express.Router();
const Crypto = require('../models/Crypto');

// Get All
router.get('/', async (req, res) => {
    try {
    const cryptos = await Crypto.find();
    res.json(cryptos);
    } catch(err){
        res.status(500).json({error: err.message})
    }
}); 

// Top Gainers (Sorted by change24h desc)
router.get('/gainers', async (req, res) => {
    try{
    const gainers = await Crypto.find().sort({ change24h: -1 });
    res.json(gainers);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
});

// New Listings (Sorted by createdAt desc)
router.get('/new', async (req, res) => {
    try{
    const news = await Crypto.find().sort({ createdAt: -1 });
    res.json(news);
    } catch(err){
        res.status(500).json({error: err.message})
    }
});

// Post New Crypto
router.post('/', async (req, res) => {
    try{
    const newCrypto = new Crypto(req.body);
    await newCrypto.save();
    res.status(201).json({message: "Cryptocurrency added", data: newCrypto});
    } catch(err){
        res.status(400).json({error: err.message})
    }
});


module.exports = router;