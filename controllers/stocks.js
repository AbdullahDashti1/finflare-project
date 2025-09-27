const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

router.get('/', async (req, res) => {
    const user = await User.findById(req.params.userId).populate('stocks');
    res.render('stocks/index.ejs', {user});
});
router.get('/new', async (req, res) => {
    res.render('stocks/new.ejs', {
        user: req.session.user,
    });
});

router.post('/users/:id/stocks', async (req, res) => {
    const user = await User.findById(req.params.userId);
    user.stocks.push(req.body);
    await user.save();
    res.redirect('/users/${user._id/stocks');
})
module.exports = router;