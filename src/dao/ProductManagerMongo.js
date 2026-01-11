import { ProductModel } from '../models/product.model.js';

class ProductManagerMongo {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    if (query) {
      filter.$or = [
        { category: query },
        { status: query === 'true' }
      ];
    }

    const options = {
      limit,
      page,
      lean: true
    };

    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    return await ProductModel.paginate(filter, options);
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async create(data) {
    return await ProductModel.create(data);
  }
}

export default ProductManagerMongo;
