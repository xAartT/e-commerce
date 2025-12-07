const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const { authenticate, isClient } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

router.use(authenticate);
router.use(isClient);

router.post('/', ordersController.createOrder);
router.get('/', validatePagination, ordersController.getOrders);
router.get('/:id', ordersController.getOrder);

module.exports = router;