const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { authenticate, isSeller, optionalAuth } = require('../middleware/auth');
const { validateProduct, validatePagination } = require('../middleware/validation');

router.get('/favorites/list', authenticate, productsController.listFavorites);
router.get('/seller/my-products', authenticate, isSeller, productsController.getSellerProducts);

router.post('/bulk', authenticate, isSeller, productsController.bulkCreateProducts);

router.get('/', optionalAuth, validatePagination, productsController.listProducts);
router.get('/:id', optionalAuth, productsController.getProduct);

router.post('/:productId/favorite', authenticate, productsController.addFavorite);
router.delete('/:productId/favorite', authenticate, productsController.removeFavorite);

router.post('/', authenticate, isSeller, validateProduct, productsController.createProduct);
router.put('/:id', authenticate, isSeller, validateProduct, productsController.updateProduct);
router.delete('/:id', authenticate, isSeller, productsController.deleteProduct);

module.exports = router;