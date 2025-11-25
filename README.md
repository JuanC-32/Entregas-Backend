# 🛒 E-commerce Backend - Primera Entrega

Backend desarrollado en Node.js con Express para la gestión de productos y carritos de compra mediante una API REST.

## 📁 Estructura del Proyecto

```
ecommerce-backend/
│
├── app.js                      # Servidor principal
├── package.json                # Dependencias y scripts
├── .gitignore                  # Archivos ignorados por Git
│
├── managers/
│   ├── ProductManager.js       # Gestión de productos
│   └── CartManager.js          # Gestión de carritos
│
├── routes/
│   ├── products.router.js      # Rutas de productos
│   └── carts.router.js         # Rutas de carritos
│
└── data/
    ├── products.json           # Persistencia de productos
    └── carts.json              # Persistencia de carritos
```

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor
```bash
npm start
```

El servidor estará corriendo en: `http://localhost:8080`

### 3. Modo desarrollo (con auto-reload)
```bash
npm run dev
```

## 📡 Endpoints Disponibles

### **Productos** (`/api/products`)

#### **GET** `/api/products`
Lista todos los productos

#### **GET** `/api/products/:pid`
Obtiene un producto específico por ID

#### **POST** `/api/products`
Crea un nuevo producto

**Body:**
```json
{
  "title": "Producto Ejemplo",
  "description": "Descripción del producto",
  "code": "ABC123",
  "price": 1000,
  "stock": 50,
  "category": "Electrónica",
  "thumbnails": ["img1.jpg", "img2.jpg"]
}
```

#### **PUT** `/api/products/:pid`
Actualiza un producto existente

#### **DELETE** `/api/products/:pid`
Elimina un producto

---

### **Carritos** (`/api/carts`)

#### **POST** `/api/carts`
Crea un nuevo carrito vacío

#### **GET** `/api/carts/:cid`
Obtiene los productos de un carrito específico

#### **POST** `/api/carts/:cid/product/:pid`
Agrega un producto al carrito (incrementa cantidad si ya existe)

## 🧪 Ejemplos de Pruebas en Postman

### 1️⃣ Crear un producto
```
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "title": "Laptop Dell",
  "description": "Laptop de alto rendimiento",
  "code": "DELL-001",
  "price": 1200,
  "stock": 10,
  "category": "Computadoras",
  "thumbnails": ["dell1.jpg"]
}
```

### 2️⃣ Obtener todos los productos
```
GET http://localhost:8080/api/products
```

### 3️⃣ Crear un carrito
```
POST http://localhost:8080/api/carts
```

### 4️⃣ Agregar producto al carrito
```
POST http://localhost:8080/api/carts/1/product/1
```

### 5️⃣ Ver productos del carrito
```
GET http://localhost:8080/api/carts/1
```

### 6️⃣ Actualizar un producto
```
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "price": 1100,
  "stock": 15
}
```

### 7️⃣ Eliminar un producto
```
DELETE http://localhost:8080/api/products/1
```

## ✅ Características Implementadas

- ✔ Servidor Express en puerto 8080
- ✔ Rutas organizadas con Router de Express
- ✔ IDs autogenerados para productos y carritos
- ✔ Validación de campos obligatorios
- ✔ Código único por producto
- ✔ Persistencia en archivos JSON
- ✔ Incremento de cantidad si el producto ya existe en el carrito
- ✔ Manejo de errores completo
- ✔ Respuestas JSON estructuradas

## 📝 Notas Importantes

- Los archivos `products.json` y `carts.json` se crean automáticamente al iniciar el servidor
- Los IDs son autoincrementales
- El campo `status` tiene valor `true` por defecto
- El campo `thumbnails` es opcional y se inicializa como array vacío si no se proporciona
- No se puede modificar el ID de un producto al actualizarlo
- El código de producto debe ser único

## 🔧 Tecnologías Utilizadas

- Node.js
- Express.js
- File System (fs/promises)
- ES Modules

## 👨‍💻 Desarrollo

Proyecto desarrollado como Primera Entrega del curso de Backend.