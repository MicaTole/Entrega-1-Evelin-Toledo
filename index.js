const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://todocoder:<db_password>@cluster013.p4xscoc.mongodb.net/?appName=Cluster013', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexión a MongoDB Atlas:', err));

const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const Product = require('./models/product'); // Importa el modelo de producto

const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.json());

// Middleware para pasar io a las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta principal usando Mongoose
app.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('home', { products });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado');
});

server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));