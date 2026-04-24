const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const stockMovementService = require('../services/stockMovementService');

const router = express.Router();

router.post('/receive', auth, adminOnly, async (req, res, next) => {
  try {
    const { category, productName, size, quantity, notes } = req.body;
    if (!category || !productName || !size || !quantity) {
      return res.status(400).json({ error: 'カテゴリ、商品名、サイズ、数量は必須です' });
    }
    const result = await stockMovementService.receiveStock({
      category,
      productName,
      size,
      quantity: Number(quantity),
      operatedBy: req.employee.employeeName,
      notes,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/issue', auth, adminOnly, async (req, res, next) => {
  try {
    const { orderId, notes } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: '注文IDは必須です' });
    }
    const result = await stockMovementService.issueStock({
      orderId,
      operatedBy: req.employee.employeeName,
      notes,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/history', auth, adminOnly, async (req, res, next) => {
  try {
    const { type, from } = req.query;
    const history = await stockMovementService.listHistory({ type, from });
    res.json(history);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
