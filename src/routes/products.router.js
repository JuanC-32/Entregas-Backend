import { Router } from 'express';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';

const router = Router();
const productManager = new ProductManagerMongo();

router.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query
    });

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

