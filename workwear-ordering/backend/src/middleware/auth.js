const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '認証が必要です' });
  }
  const token = header.slice(7);
  try {
    req.employee = jwt.verify(token, jwtConfig.secret);
    next();
  } catch {
    res.status(401).json({ error: 'トークンが無効または期限切れです' });
  }
}

module.exports = authMiddleware;
