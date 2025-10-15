const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager');
const cm = new CartManager('carts.json');

// Crear carrito
router.post('/', async (req, res) => {
  const nuevo = await cm.createCart();
  res.status(201).json(nuevo);
});

// Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const actualizado = await cm.addProductToCart(req.params.cid, req.params.pid);
  actualizado ? res.json(actualizado) : res.status(404).json({ error: 'Error al agregar producto' });
});

module.exports = router;