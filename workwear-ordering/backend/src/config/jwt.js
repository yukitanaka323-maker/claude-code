module.exports = {
  secret: process.env.JWT_SECRET || 'change-this-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '2h',
};
