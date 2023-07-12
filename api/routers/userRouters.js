const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllersFire');

router.post('/register', userController.registrarUsuario);
router.post('/login', userController.fazerLogin);
router.post('/logout', userController.logoutUser);
router.post('/token', userController.getTokenFromServer);

module.exports = router;
