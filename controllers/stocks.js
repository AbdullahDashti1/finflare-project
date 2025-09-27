const express = require('express');
const router = express.Router();
const Stock = require('../models/stock'); 

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

router.get('/', async (req, res) => {
  const userStocks = await Stock.find({}); 
  res.render('stocks/index', { stocks, userStocks });
});

router.get('/new', (req, res) => {
  res.render('stocks/new', { stocks });
});

router.post('/', async (req, res) => {
  const { symbol, shares } = req.body; 

  const selectedStock = stocks.find(s => s.symbol === symbol);
  if (!selectedStock) return res.redirect('/stocks');

  const stock = new Stock({
    symbol: selectedStock.symbol,
    name: selectedStock.name,        
    shares: Number(shares),           
    price: selectedStock.price        
  });

  await stock.save();
  res.redirect('/stocks');
});

module.exports = router;
