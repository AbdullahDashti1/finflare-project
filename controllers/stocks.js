const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

router.get('/new', async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.render('stocks/index.ejs');
})
module.exports = router;