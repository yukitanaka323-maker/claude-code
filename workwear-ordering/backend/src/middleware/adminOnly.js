function adminOnly(req, res, next) {
  if (!req.employee || !req.employee.isAdmin) {
    return res.status(403).json({ error: '管理者権限が必要です' });
  }
  next();
}

module.exports = adminOnly;
