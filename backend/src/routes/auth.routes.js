const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, isClient, isSeller } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

router.get('/profile', authenticate, authController.getProfile);
router.delete('/account', authenticate, isClient, authController.deleteAccount);
router.post('/deactivate', authenticate, isSeller, authController.deactivateAccount);

module.exports = router;