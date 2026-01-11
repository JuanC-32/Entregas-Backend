import { Router } from 'express';
import CartManagerMongo from '../dao/CartManagerMongo.js';

const router = Router();
const cartManager = new CartManagerMongo();

router.post('/', async (req, res) => {
  const cart = await cartManager.createCart();
  res.json({ status: 'success', payload: cart });
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  res.json({ status: 'success', payload: cart });
});

router.post('/:cid/products/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  res.json({ status: 'success', payload: cart });
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const cart = await cartManager.deleteProductFromCart(
    req.params.cid,
    req.params.pid
  );
  res.json({ status: 'success', payload: cart });
});

router.put('/:cid', async (req, res) => {
  const cart = await cartManager.updateCart(
    req.params.cid,
    req.body.products
  );
  res.json({ status: 'success', payload: cart });
});

router.put('/:cid/products/:pid', async (req, res) => {
  const cart = await cartManager.updateProductQuantity(
    req.params.cid,
    req.params.pid,
    req.body.quantity
  );
  res.json({ status: 'success', payload: cart });
});

router.delete('/:cid', async (req, res) => {
  const cart = await cartManager.clearCart(req.params.cid);
  res.json({ status: 'success', payload: cart });
});

export default router;
