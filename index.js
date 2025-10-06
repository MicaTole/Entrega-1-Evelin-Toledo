const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const exphbs = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 8080;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());


app.get('/', async (req, res) => {
  const products = await pm.getProducts();
  res.render('home', { products });
});

const pm = new ProductManager('products.json');
const cm = new CartManager('carts.json');

app.use(express.json());

// GET todos
app.get('/api/products', async (req, res) => {
  res.json(await pm.getProducts());
});

// GET por id
app.get('/api/products/:pid', async (req, res) => {
  const prod = await pm.getProductById(req.params.pid);
  prod ? res.json(prod) : res.status(404).json({ error: 'No encontrado' });
});

// POST crear
app.post('/api/products', async (req, res) => {
  try {
    const nuevo = await pm.addProduct(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT actualizar
app.put('/api/products/:pid', async (req, res) => {
  const actualizado = await pm.updateProduct(req.params.pid, req.body);
  actualizado ? res.json(actualizado) : res.status(404).json({ error: 'No encontrado' });
});

// DELETE eliminar
app.delete('/api/products/:pid', async (req, res) => {
  const eliminado = await pm.deleteProduct(req.params.pid);
  eliminado ? res.sendStatus(204) : res.status(404).json({ error: 'No encontrado' });
});

//Profe me costo el tema de rutas//
// POST crear carrito
app.post('/api/carts', async (req, res) => {
  res.status(201).json(await cm.createCart());
});

// GET productos de un carrito
app.get('/api/carts/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// POST agregar producto a carrito
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const actualizado = await cm.addProductToCart(req.params.cid, req.params.pid);
  actualizado ? res.json(actualizado) : res.status(404).json({ error: 'Error al agregar producto' });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');
});



app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
