const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

// login page
router.get('/', authController.login);
// profile page
router.get('/profile', authController.profile);
// index page
router.get('/logout', authController.logout);
// redirect URL for auth
router.get('/auth/redirect', authController.authRedirect);

module.exports = router;