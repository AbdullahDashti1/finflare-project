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

module.exports = router;