const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    product.id = (products.length ? (parseInt(products[products.length - 1].id) + 1) : 1).toString();
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async updateProduct(id, update) {
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id == id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...update, id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[idx];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id == id);
    if (idx === -1) return null;
    const deleted = products.splice(idx, 1);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return deleted[0];
  }
}

module.exports = ProductManager;