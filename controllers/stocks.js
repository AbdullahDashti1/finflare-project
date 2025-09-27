const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

router.get('/stocks', async (req, res) => {
    const stocks = await Stock.find({});
    res.render('stocks/index', { stocks });
});

router.get('/portfolio', async (req, res) => {
    const user = await User.findById(req.session.userId).populate('stocks');
    res.render('stocks/portfolio', { user });
});

router.post('/stocks', async (req, res) => {
    const user = req.user;

    const stock = new Stock({
        name: req.body.name
    });
    await stock.save();

    user.stocks.push(stock);
    await user.save();

    res.redirect('/portfolio'); 
});

module.exports = router;