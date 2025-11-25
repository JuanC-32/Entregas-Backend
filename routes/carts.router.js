import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST / - Crear nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ 
      status: 'success', 
      message: 'Carrito creado exitosamente',
      payload: newCart 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /:cid - Obtener productos del carrito
router.get('/:cid', async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    
    if (isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    const cart = await cartManager.getCartById(id);
    
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart.products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    
    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    const updatedCart = await cartManager.addProductToCart(cartId, productId);
    res.json({ 
      status: 'success', 
      message: 'Producto agregado al carrito',
      payload: updatedCart 
    });
  } catch (error) {
    const statusCode = error.message === 'Carrito no encontrado' ? 404 : 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
});

export default router;