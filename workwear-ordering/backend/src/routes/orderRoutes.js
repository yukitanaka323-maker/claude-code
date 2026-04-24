const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const orderService = require('../services/orderService');

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  try {
    const { category, productName, size, quantity, notes } = req.body;
    if (!category || !productName || !size || !quantity) {
      return res.status(400).json({ error: 'カテゴリ、商品名、サイズ、数量は必須です' });
    }
    const orderId = await orderService.createOrder({
      employee: req.employee,
      category,
      productName,
      size,
      quantity: Number(quantity),
      notes,
    });
    res.status(201).json({ orderId });
  } catch (err) {
    next(err);
  }
});

router.get('/', auth, adminOnly, async (req, res, next) => {
  try {
    const { status, category, from } = req.query;
    const orders = await orderService.listOrders({ status, category, from });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', auth, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['キャンセル'].includes(status)) {
      return res.status(400).json({ error: '無効なステータスです' });
    }
    await orderService.updateOrderStatus(req.params.id, status, req.employee.employeeName);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
