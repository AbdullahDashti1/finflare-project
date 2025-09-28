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

router.get('/:stockId/edit', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const stock = await Stock.findById(req.params.stockId);
  if (!stock || !stock.user.equals(req.session.user._id)) {
    return res.send("You don't have permission to edit this stock.");
  }

  res.render('stocks/edit', { stock, stocks }); 
});

router.put('/:stockId', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const stock = await Stock.findById(req.params.stockId);
  if (!stock || !stock.user.equals(req.session.user._id)) {
    return res.send("You don't have permission to edit this stock.");
  }

  const { symbol, shares } = req.body;
  const selectedStock = stocks.find(s => s.symbol === symbol);
  if (!selectedStock) return res.redirect('/stocks');

  stock.symbol = selectedStock.symbol;
  stock.name = selectedStock.name;
  stock.shares = Number(shares);
  stock.price = selectedStock.price;

  await stock.save();
  res.redirect('/stocks');
});


router.post('/', async (req, res) => {
  const { symbol, shares } = req.body;
  const selectedStock = stocks.find(s => s.symbol === symbol);
  if (!selectedStock) return res.redirect('/stocks');

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
  res.redirect('/stocks');
});

router.delete('/:stockId', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const stock = await Stock.findById(req.params.stockId);
  if (!stock || !stock.user.equals(req.session.user._id)) return res.redirect('/stocks');

  const availableStock = stocks.find(s => s.symbol === stock.symbol);
  if (availableStock) {
    availableStock.shares += stock.shares; 
  }

  await stock.deleteOne();
  res.redirect('/stocks');
});

module.exports = router;
