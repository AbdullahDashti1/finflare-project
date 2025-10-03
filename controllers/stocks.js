const express = require('express');
const router = express.Router();
const Stock = require('../models/stock');
const User = require('../models/user'); 

const stocks = [
  { symbol: 'AAPL', name: "Apple's stock", shares: 500, price: 200 },
  { symbol: 'NVDA', name: "Nvidia's stock", shares: 200, price: 450 },
  { symbol: 'AMZN', name: "Amazon's stock", shares: 400, price: 180 },
  { symbol: 'MSFT', name: "Microsoft's stock", shares: 150, price: 300 },
  { symbol: 'SSNLF', name: "Samsung's stock", shares: 600, price: 90 },
  { symbol: 'TSLA', name: "Tesla's stock", shares: 300, price: 250 },
  { symbol: 'F', name: "Ford's stock", shares: 1000, price: 15 },
  { symbol: 'GM', name: "General Motors' stock", shares: 800, price: 310 },
  { symbol: 'TM', name: "Toyota's stock", shares: 225, price: 300 },
  { symbol: 'VWAGY', name: "Volkswagen's stock", shares: 150, price: 155 },
  { symbol: 'QTR', name: "Qatar Airways' stock", shares: 800, price: 50 },
  { symbol: 'EMR', name: "Emirates Airline's stock", shares: 1000, price: 70 },
  { symbol: 'SDA', name: "Saudia's stock", shares: 600, price: 40 },
  { symbol: 'BAH', name: "Gulf Air's stock", shares: 400, price: 30 },
  { symbol: 'OMA', name: "Oman Air's stock", shares: 350, price: 30 }
];

// Index - Portfolio page showing all user's stocks
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/sign-in');

    const user = await User.findById(req.session.user._id);
    const userStocks = await Stock.find({ user: req.session.user._id });

    res.render('stocks/index', { 
      stocks, 
      userStocks, 
      userEarnings: user.earnings || 0,
      user: req.session.user,
      page: 'portfolio'
    });
  } catch (error) {
    console.error('Error in GET /stocks:', error);
    res.status(500).send('Server error');
  }
});

// New - Show form to buy a new stock (MUST come before /:stockId)
router.get('/new', (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/sign-in');
    
    res.render('stocks/new', { 
      stocks,
      user: req.session.user,
      page: 'buy'
    });
  } catch (error) {
    console.error('Error in GET /stocks/new:', error);
    res.status(500).send('Server error');
  }
});

// Edit - Show form to edit an existing stock (MUST come before /:stockId)
router.get('/:stockId/edit', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/sign-in');

    const stock = await Stock.findById(req.params.stockId);
    
    if (!stock) {
      return res.status(404).send("Stock not found.");
    }
    
    if (!stock.user.equals(req.session.user._id)) {
      return res.status(403).send("You don't have permission to edit this stock.");
    }

    res.render('stocks/edit', { 
      stock, 
      stocks,
      user: req.session.user,
      page: 'portfolio'
    });
  } catch (error) {
    console.error('Error in GET /stocks/:stockId/edit:', error);
    res.status(500).send('Server error');
  }
});

// Show - Display individual stock details (comes after /new and /:id/edit)
router.get('/:stockId', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/sign-in');

    const stock = await Stock.findById(req.params.stockId);
    
    if (!stock) {
      return res.status(404).send("Stock not found.");
    }
    
    if (!stock.user.equals(req.session.user._id)) {
      return res.status(403).send("You don't have permission to view this stock.");
    }

    res.render('stocks/show', { 
      stock,
      user: req.session.user,
      page: 'portfolio'
    });
  } catch (error) {
    console.error('Error in GET /stocks/:stockId:', error);
    res.status(500).send('Server error');
  }
});

// Create - Process buying a new stock
router.post('/', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/sign-in');

    console.log('POST /stocks - Creating new stock:', req.body);

    const { symbol, shares } = req.body;
    const selectedStock = stocks.find(s => s.symbol === symbol);
    
    if (!selectedStock) {
      console.log('Stock not found:', symbol);
      return res.redirect('/stocks');
    }

    const sharesToBuy = Number(shares);

    if (sharesToBuy > selectedStock.shares) {
      return res.send(`Not enough shares available. Only ${selectedStock.shares} left.`);
    }

    selectedStock.shares -= sharesToBuy;

    const stock = new Stock({
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      shares: sharesToBuy,
      price: selectedStock.price,
      user: req.session.user._id
    });

    await stock.save();
    console.log('Stock created successfully:', stock);
    res.redirect('/stocks');
  } catch (error) {
    console.error('Error in POST /stocks:', error);
    res.status(500).send('Server error');
  }
});

// Update - Process the edit form
router.put('/:stockId', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/sign-in');

    console.log('PUT /stocks/:stockId - Updating stock:', req.params.stockId, req.body);

    const stock = await Stock.findById(req.params.stockId);
    
    if (!stock) {
      return res.status(404).send("Stock not found.");
    }
    
    if (!stock.user.equals(req.session.user._id)) {
      return res.status(403).send("You don't have permission to edit this stock.");
    }

    const { symbol, shares } = req.body;
    const selectedStock = stocks.find(s => s.symbol === symbol);
    
    if (!selectedStock) {
      console.log('Selected stock not found:', symbol);
      return res.redirect('/stocks');
    }

    stock.symbol = selectedStock.symbol;
    stock.name = selectedStock.name;
    stock.shares = Number(shares);
    stock.price = selectedStock.price;

    await stock.save();
    console.log('Stock updated successfully:', stock);
    res.redirect('/stocks');
  } catch (error) {
    console.error('Error in PUT /stocks/:stockId:', error);
    res.status(500).send('Server error');
  }
});

// Delete - Remove a stock from portfolio
router.delete('/:stockId', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/sign-in');

    console.log('DELETE /stocks/:stockId - Deleting stock:', req.params.stockId);

    const stock = await Stock.findById(req.params.stockId);
    
    if (!stock) {
      console.log('Stock not found for deletion');
      return res.redirect('/stocks');
    }
    
    if (!stock.user.equals(req.session.user._id)) {
      console.log('User does not own this stock');
      return res.redirect('/stocks');
    }

    const availableStock = stocks.find(s => s.symbol === stock.symbol);
    if (availableStock) {
      availableStock.shares += stock.shares;
      console.log('Returned shares to pool:', stock.shares);
    }

    await stock.deleteOne();
    console.log('Stock deleted successfully');
    res.redirect('/stocks');
  } catch (error) {
    console.error('Error in DELETE /stocks/:stockId:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;