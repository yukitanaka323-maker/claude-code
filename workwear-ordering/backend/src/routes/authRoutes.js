const express = require('express');
const jwt = require('jsonwebtoken');
const employeeService = require('../services/employeeService');
const jwtConfig = require('../config/jwt');

const router = express.Router();

router.post('/scan', async (req, res, next) => {
  try {
    const { authNumber } = req.body;
    if (!authNumber || typeof authNumber !== 'string' || authNumber.trim() === '') {
      return res.status(400).json({ error: '認証番号が必要です' });
    }
    const employee = await employeeService.findByAuthNumber(authNumber.trim());
    if (!employee) {
      return res.status(401).json({ error: '社員が見つかりません' });
    }
    const token = jwt.sign(
      {
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        department: employee.department,
        isAdmin: employee.isAdmin,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    res.json({ token, employee });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
