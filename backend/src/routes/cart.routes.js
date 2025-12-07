const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate, isClient } = require('../middleware/auth');
const { validateCartItem } = require('../middleware/validation');
const { body } = require('express-validator');

router.use(authenticate);
router.use(isClient);

const validateQuantityUpdate = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número positivo')
];

router.get('/', cartController.getCart);
router.post('/', validateCartItem, cartController.addToCart);
router.put('/:product_id', validateQuantityUpdate, cartController.updateCartItem);
router.delete('/:product_id', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);

module.exports = router;