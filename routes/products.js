
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, category, status } = req.query;
  const query = {};
  if (category) query.category = category;
  if (status !== undefined) query.status = status === 'true';

  let sortOption = {};
  if (sort === 'asc') sortOption.price = 1;
  if (sort === 'desc') sortOption.price = -1;

  const options = {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    sort: sortOption
  };

  const products = await Product.find(query, null, options);
  const total = await Product.countDocuments(query);

  res.json({
    status: 'success',
    payload: products,
    totalPages: Math.ceil(total / options.limit),
    prevPage: page > 1 ? Number(page) - 1 : null,
    nextPage: page < Math.ceil(total / options.limit) ? Number(page) + 1 : null,
    page: Number(page)
  });
});

// Obtener producto por id
router.get('/:pid', async (req, res) => {
  const prod = await Product.findById(req.params.pid);
  prod ? res.json(prod) : res.status(404).json({ error: 'No encontrado' });
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const nuevo = await Product.create(req.body);
    req.io.emit('nuevoProducto', nuevo);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar producto
router.put('/:pid', async (req, res) => {
  const actualizado = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
  actualizado ? res.json(actualizado) : res.status(404).json({ error: 'No encontrado' });
});

// Eliminar producto
router.delete('/:pid', async (req, res) => {
  const eliminado = await Product.findByIdAndDelete(req.params.pid);
  eliminado ? res.sendStatus(204) : res.status(404).json({ error: 'No encontrado' });
});

module.exports = router;