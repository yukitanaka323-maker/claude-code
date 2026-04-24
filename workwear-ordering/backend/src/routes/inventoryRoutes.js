const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const inventoryService = require('../services/inventoryService');

const router = express.Router();

router.get('/', auth, adminOnly, async (req, res, next) => {
  try {
    const inventory = await inventoryService.listInventory();
    res.json(inventory);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
