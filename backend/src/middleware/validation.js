// src/middleware/validation.js
const { body, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('role')
    .isIn(['CLIENT', 'SELLER'])
    .withMessage('Role deve ser CLIENT ou SELLER'),
  validate
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  validate
];

const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ max: 255 })
    .withMessage('Nome muito longo'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  body('description')
    .optional()
    .trim(),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('URL da imagem inválida'),
  validate
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100'),
  validate
];

const validateCartItem = [
  body('product_id')
    .isUUID()
    .withMessage('ID do produto inválido'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número positivo'),
  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateProduct,
  validatePagination,
  validateCartItem
};