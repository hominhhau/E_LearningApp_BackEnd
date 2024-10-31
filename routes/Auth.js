const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/loginByPhone', authController.loginByPhone);
router.post('/registerByPhone', authController.registerByPhone);

module.exports = router;