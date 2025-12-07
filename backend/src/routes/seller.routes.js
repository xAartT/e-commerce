const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const { authenticate, isSeller } = require('../middleware/auth');

router.use(authenticate);
router.use(isSeller);

router.get('/dashboard', sellerController.getDashboard);

module.exports = router;