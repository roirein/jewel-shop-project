const express = require('express');
const { registerNewUser, loginUser, logoutUser, sendResetPasswordCode, verifyCode, updatePassword } = require('../controllers/user');
const { authorizeUser } = require('../middleware/authentication');
const router = express.Router();

router.post('/register', registerNewUser);

router.post('/login', loginUser);

router.post('/logout', authorizeUser, logoutUser)

router.post('/resetPassword', sendResetPasswordCode)

router.post('/verifyCode', verifyCode);

router.patch('/updatePassword', updatePassword)

module.exports = router;