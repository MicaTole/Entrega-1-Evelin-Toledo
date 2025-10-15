
const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const pm = new ProductManager('products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
  res.json(await pm.getProducts());
});

// Obtener producto por id
router.get('/:pid', async (req, res) => {
  const prod = await pm.getProductById(req.params.pid);
  prod ? res.json(prod) : res.status(404).json({ error: 'No encontrado' });
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const nuevo = await pm.addProduct(req.body);
    req.io.emit('nuevoProducto', nuevo); // Emitir por websocket
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar producto
router.put('/:pid', async (req, res) => {
  const actualizado = await pm.updateProduct(req.params.pid, req.body);
  actualizado ? res.json(actualizado) : res.status(404).json({ error: 'No encontrado' });
});

// Eliminar producto
router.delete('/:pid', async (req, res) => {
  const eliminado = await pm.deleteProduct(req.params.pid);
  eliminado ? res.sendStatus(204) : res.status(404).json({ error: 'No encontrado' });
});

module.exports = router;