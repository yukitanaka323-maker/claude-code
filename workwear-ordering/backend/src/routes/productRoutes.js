const express = require('express');
const auth = require('../middleware/auth');
const products = require('../config/products');

const router = express.Router();

router.get('/', auth, (req, res) => {
  res.json(products);
});

module.exports = router;
