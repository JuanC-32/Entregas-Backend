import { Router } from 'express';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';
import CartManagerMongo from '../dao/CartManagerMongo.js';

const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

const CART_ID = 'PEGA_AQUI_UN_CART_ID_REAL';

router.get('/products', async (req, res) => {
  const result = await productManager.getProducts(req.query);

  res.render('index', {
    products: result.docs,
    ...result,
    cartId: CART_ID
  });
});

router.get('/products/:pid', async (req, res) => {
  const product = await productManager.getById(req.params.pid);

  res.render('productDetail', {
    product,
    cartId: CART_ID
  });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);

  res.render('cart', { cart });
});

export default router;

