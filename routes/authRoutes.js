const express = require('express');
const { signUpAdmin, login, registerUser } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUpAdmin); 
router.post('/login', login); 
router.post('/register', registerUser); 

module.exports = router;
