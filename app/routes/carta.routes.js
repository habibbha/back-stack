const express = require('express');
const router = express.Router();
const cartaController = require('../controllers/carta.controller');
const { verifyToken } = require('../middlewares/authJwt');

router.post('/:cartId/add', cartaController.addToCarta);
router.get('/:cartId/getCarta', verifyToken, cartaController.getCarta);
router.post('/:cartId/userinfo', verifyToken, cartaController.updateCartWithUserInfo);
router.delete('/:cartId/items/:itemId', cartaController.removeItemFromCart);
router.put('/:cartId/items/:itemId', cartaController.updateItemQuantity);
router.get('/all', cartaController.getAllCarts);
router.get('/user/:userId', verifyToken, cartaController.getCartsByUserId);

module.exports = router;
