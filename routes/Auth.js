const router = require('express').Router();
const authController = require('../controllers/authController');


router.post('/loginByPhone', authController.loginByPhone);
router.post('/registerByPhone', authController.registerByPhone);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/verify-reset-token', authController.verifyResetToken);
//router.post('/reset-password', authController.resetPassword);


module.exports = router;