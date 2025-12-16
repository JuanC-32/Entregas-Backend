import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    if (!fs.existsSync(this.path)) return [];
    return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
  }

  async createCart() {
    const carts = await this.getCarts();
    const cart = { id: Date.now().toString(), products: [] };
    carts.push(cart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cid);
    const product = cart.products.find(p => p.product === pid);

    product ? product.quantity++ : cart.products.push({ product: pid, quantity: 1 });

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
  }
}

