import { CartModel } from '../models/cart.model.js';

class CartManagerMongo {

  async createCart() {
    return await CartModel.create({ products: [] });
  }

  async getCartById(cid) {
    return await CartModel
      .findById(cid)
      .populate('products.product')
      .lean();
  }

  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (productIndex === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    return await cart.save();
  }

  async deleteProductFromCart(cid, pid) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
  }

  async updateCart(cid, products) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { products },
      { new: true }
    );
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);

    const product = cart.products.find(p => p.product.toString() === pid);
    product.quantity = quantity;

    return await cart.save();
  }

  async clearCart(cid) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    );
  }
}

export default CartManagerMongo;
