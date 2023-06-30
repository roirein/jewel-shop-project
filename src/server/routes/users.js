const express = require('express');
const { registerNewUser, loginUser, logoutUser } = require('../controllers/user');
const { authorizeUser } = require('../middleware/authentication');
const router = express.Router();

router.post('/register', registerNewUser);

router.post('/login', loginUser);

router.post('/logout', authorizeUser, logoutUser)

module.exports = router;