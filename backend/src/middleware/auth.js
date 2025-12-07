// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const isSeller = (req, res, next) => {
  if (req.user.role !== 'SELLER') {
    return res.status(403).json({ error: 'Acesso negado. Apenas vendedores.' });
  }
  next();
};

const isClient = (req, res, next) => {
  if (req.user.role !== 'CLIENT') {
    return res.status(403).json({ error: 'Acesso negado. Apenas clientes.' });
  }
  next();
};
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
  }
  next();
};

module.exports = {
  authenticate,
  isSeller,
  isClient,
  optionalAuth
};