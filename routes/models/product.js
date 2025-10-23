const mongoose = require('mongoose');
const Product = require('../models/product');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [String]
});

module.exports = mongoose.model('Product', productSchema);