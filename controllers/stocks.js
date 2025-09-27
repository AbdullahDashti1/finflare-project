const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Stock = require('../models/stock');

router.get('/', (req, res) => {
const stocks = [
  { symbol: 'AAPL', name: "Apple's stock", shares: 500, volatility: 'Moderate', investment: 100000, price: 200 },
  { symbol: 'NVDA', name: "Nvidia's stock", shares: 200, volatility: 'High', investment: 90000, price: 450 },
  { symbol: 'AMZN', name: "Amazon's stock", shares: 400, volatility: 'Low', investment: 72000, price: 180 },
  { symbol: 'MSFT', name: "Microsoft's stock", shares: 150, volatility: 'Low-to-Moderate', investment: 45000, price: 300 },
  { symbol: 'SSNLF', name: "Samsung's stock", shares: 600, volatility: 'Moderate', investment: 54000, price: 90 },
  { symbol: 'TSLA', name: "Tesla's stock", shares: 300, volatility: 'High', investment: 75000, price: 250 },
  { symbol: 'F', name: "Ford's stock", shares: 1000, volatility: 'Moderate', investment: 15000, price: 15 },
  { symbol: 'GM', name: "General Motors' stock", shares: 800, volatility: 'High', investment: 248000, price: 310 },
  { symbol: 'TM', name: "Toyota's stock", shares: 225, volatility: 'Low-to-Moderate', investment: 67500, price: 300 },
  { symbol: 'VWAGY', name: "Volkswagen's stock", shares: 150, volatility: 'Moderate', investment: 23250, price: 155 },
  { symbol: 'QTR', name: "Qatar Airways' stock", shares: 800, volatility: 'Moderate', investment: 40000, price: 50 },
  { symbol: 'EMR', name: "Emirates Airline's stock", shares: 1000, volatility: 'Moderate', investment: 70000, price: 70 },
  { symbol: 'SDA', name: "Saudia's stock", shares: 600, volatility: 'High', investment: 24000, price: 40 },
  { symbol: 'BAH', name: "Gulf Air's stock", shares: 400, volatility: 'High', investment: 12000, price: 30 },
  { symbol: 'OMA', name: "Oman Air's stock", shares: 350, volatility: 'Moderate-to-High', investment: 10500, price: 30 }
];

  res.render('stocks/index', { stocks });
});

router.get('/', (req, res) => {
  res.render('stocks/index', { stocks });
});

router.get('/portfolio', async (req, res) => {
  const user = req.user;
  if (!user) return res.redirect('/auth/login');

  res.render('stocks/portfolio', { user });
});

router.post('/', async (req, res) => {
  const user = req.user;
  if (!user) return res.redirect('/auth/login');

  const stockToBuy = stocks.find(s => s.symbol === req.body.symbol);
  if (!stockToBuy) return res.send("Stock not found");

  user.stocks.push({ 
    name: stockToBuy.name, 
    shares: stockToBuy.shares, 
    purchaseDate: new Date() 
  });

  await user.save();
  res.redirect('/stocks/portfolio');
});

module.exports = router;
