import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class CartManager {
  /**
   * @param {string} [filePath]
   */
  constructor(filePath) {
    this.path = filePath
      ? path.resolve(filePath)
      : path.join(__dirname, '../data/carts.json');

    // Cadena de promesa Mutex para serializar operaciones de escritura
    this._lock = Promise.resolve();

    // Promesa lista para garantizar que la inicialización se complete antes de las operaciones
    this.ready = this.init();
  }

  // Inicializar archivo de almacenamiento (crea carpeta + archivo si falta)
  async init() {
    try {
      await fs.access(this.path);
      // El archivo existe, no hay nada que hacer
    } catch (err) {
      // crear directorio y archivo
      await fs.mkdir(path.dirname(this.path), { recursive: true });
      await this._atomicWrite([], this.path);
    }
  }

  // Asistente interno: realiza una operación bajo bloqueo
  async _withLock(fn) {
    // Operaciones en cadena para garantizar la serialización
    this._lock = this._lock.then(() => fn());
    return this._lock;
  }

  // Asistente interno: escritura atómica (escribe en temporal y luego renombra)
  async _atomicWrite(obj, targetPath) {
    const tmpPath = `${targetPath}.tmp`;
    const data = JSON.stringify(obj, null, 2);
    await fs.writeFile(tmpPath, data, 'utf8');
    await fs.rename(tmpPath, targetPath);
  }

  // Cargar carritos. Si el JSON está corrupto, se lanza — para evitar la pérdida silenciosa de datos.
  async _readFile() {
    await this.ready;
    try {
      const txt = await fs.readFile(this.path, 'utf8');
      return JSON.parse(txt);
    } catch (err) {
      // Distinguir entre no encontrado y error de análisis
      if (err.code === 'ENOENT') {
        // Intenta reiniciar y volver vacío
        await this.init();
        return [];
      }
      // Si JSON.parse genera un error, vuelva a generarlo para detectar la corrupción superficial
      throw new Error(`Error leyendo archivo de carritos: ${err.message}`);
    }
  }

  // Public: obtener todos los carritos
  async getCarts() {
    return this._readFile();
  }

  // Normalizar id a cadena para comparaciones consistentes
  _normalizeId(id) {
    return id === undefined || id === null ? id : String(id);
  }

  // Interno: buscar índice de carrito por id
  async _findCartIndexById(carts, id) {
    const nid = this._normalizeId(id);
    return carts.findIndex((c) => this._normalizeId(c.id) === nid);
  }

  // Obtener carrito por id
  async getCartById(id) {
    const carts = await this._readFile();
    const index = await this._findCartIndexById(carts, id);
    return index === -1 ? null : carts[index];
  }

  // Crear nuevo carrito 
  async createCart() {
    return this._withLock(async () => {
      const carts = await this._readFile();

      // generar nuevo id
      let newId;
      const numericIds = carts.every(c => !isNaN(Number(c.id)));
      if (carts.length === 0) {
        newId = numericIds ? 1 : `${Date.now()}-${Math.floor(Math.random()*1000)}`;
      } else if (numericIds) {
        const maxId = Math.max(...carts.map(c => Number(c.id)));
        newId = maxId + 1;
      } else {
        newId = `${Date.now()}-${Math.floor(Math.random()*1000)}`;
      }

      const newCart = { id: newId, products: [] };
      carts.push(newCart);
      await this._atomicWrite(carts, this.path);
      return newCart;
    });
  }

  // Añadir producto (incrementa cantidad si existe)
  async addProductToCart(cartId, productId, quantity = 1) {
    if (quantity <= 0) throw new Error('Quantity must be > 0');
    return this._withLock(async () => {
      const carts = await this._readFile();
      const cartIndex = await this._findCartIndexById(carts, cartId);
      if (cartIndex === -1) throw Object.assign(new Error('Cart not found'), { code: 'NOT_FOUND' });

      const cart = carts[cartIndex];
      const pid = this._normalizeId(productId);

      const prodIndex = cart.products.findIndex(p => this._normalizeId(p.product) === pid);
      if (prodIndex === -1) {
        cart.products.push({ product: productId, quantity });
      } else {
        cart.products[prodIndex].quantity = Number(cart.products[prodIndex].quantity) + Number(quantity);
      }

      await this._atomicWrite(carts, this.path);
      return cart;
    });
  }

  // Actualizar la cantidad del producto (establecer la cantidad exacta; si la cantidad <=0 eliminar el producto)
  async updateProductQuantity(cartId, productId, quantity) {
    if (typeof quantity !== 'number' || Number.isNaN(quantity)) throw new Error('Quantity must be a number');
    return this._withLock(async () => {
      const carts = await this._readFile();
      const cartIndex = await this._findCartIndexById(carts, cartId);
      if (cartIndex === -1) throw Object.assign(new Error('Cart not found'), { code: 'NOT_FOUND' });

      const cart = carts[cartIndex];
      const pid = this._normalizeId(productId);
      const prodIndex = cart.products.findIndex(p => this._normalizeId(p.product) === pid);
      if (prodIndex === -1) throw Object.assign(new Error('Product not found in cart'), { code: 'NOT_FOUND' });

      if (quantity <= 0) {
        // eliminar producto
        cart.products.splice(prodIndex, 1);
      } else {
        cart.products[prodIndex].quantity = Number(quantity);
      }

      await this._atomicWrite(carts, this.path);
      return cart;
    });
  }

  // Elimina el producto por completo
  async removeProductFromCart(cartId, productId) {
    return this._withLock(async () => {
      const carts = await this._readFile();
      const cartIndex = await this._findCartIndexById(carts, cartId);
      if (cartIndex === -1) throw Object.assign(new Error('Cart not found'), { code: 'NOT_FOUND' });

      const cart = carts[cartIndex];
      const pid = this._normalizeId(productId);
      const beforeLen = cart.products.length;
      cart.products = cart.products.filter(p => this._normalizeId(p.product) !== pid);
      const afterLen = cart.products.length;
      if (beforeLen === afterLen) throw Object.assign(new Error('Product not found in cart'), { code: 'NOT_FOUND' });

      await this._atomicWrite(carts, this.path);
      return cart;
    });
  }

  // Vaciar carrito (eliminar todos los productos)
  async clearCart(cartId) {
    return this._withLock(async () => {
      const carts = await this._readFile();
      const cartIndex = await this._findCartIndexById(carts, cartId);
      if (cartIndex === -1) throw Object.assign(new Error('Cart not found'), { code: 'NOT_FOUND' });

      carts[cartIndex].products = [];
      await this._atomicWrite(carts, this.path);
      return carts[cartIndex];
    });
  }

  // Eliminar todo el carrito
  async deleteCart(cartId) {
    return this._withLock(async () => {
      const carts = await this._readFile();
      const cartIndex = await this._findCartIndexById(carts, cartId);
      if (cartIndex === -1) throw Object.assign(new Error('Cart not found'), { code: 'NOT_FOUND' });

      const [deleted] = carts.splice(cartIndex, 1);
      await this._atomicWrite(carts, this.path);
      return deleted;
    });
  }
}

export default CartManager;
