const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');

// Crear carrito vacío
router.post('/', async (req, res) => {
  const nuevo = await Cart.create({ products: [] });
  res.status(201).json(nuevo);
});

// Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product');
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  const product = await Product.findById(req.params.pid);
  if (!cart || !product) return res.status(404).json({ error: 'Carrito o producto no encontrado' });

  // Buscar si el producto ya está en el carrito
  const prodIndex = cart.products.findIndex(p => p.product.equals(product._id));
  if (prodIndex !== -1) {
    cart.products[prodIndex].quantity += 1;
  } else {
    cart.products.push({ product: product._id, quantity: 1 });
  }
  await cart.save();
  res.json(cart);
});

module.exports = router;