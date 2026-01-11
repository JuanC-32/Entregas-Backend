🛒 E-commerce Backend – Entrega Final

Backend desarrollado en Node.js + Express, con MongoDB como sistema de persistencia, gestión avanzada de productos y carritos, paginación profesional, relaciones entre modelos y vistas con Handlebars.

🎯 Objetivo del Proyecto

Construir una API REST profesional para un e-commerce que permita:

Gestionar productos con filtros, paginación y ordenamiento

Gestionar carritos con referencias reales a productos

Persistir la información en MongoDB

Visualizar productos y carritos mediante vistas renderizadas

Dejar una arquitectura escalable y defendible

📁 Estructura del Proyecto
src/
├── app.js
├── config/
│   └── db.js
├── dao/
│   ├── ProductManagerMongo.js
│   └── CartManagerMongo.js
├── models/
│   ├── product.model.js
│   └── cart.model.js
├── routes/
│   ├── products.router.js
│   ├── carts.router.js
│   └── views.router.js
├── views/
│   ├── index.handlebars
│   ├── productDetail.handlebars
│   └── cart.handlebars
└── public/

🚀 Instalación y Ejecución
1️⃣ Instalar dependencias
npm install

2️⃣ Levantar MongoDB

Asegúrate de tener MongoDB corriendo localmente:

mongod

3️⃣ Iniciar el servidor
npm start


Servidor disponible en:

http://localhost:8080

🔧 Tecnologías Utilizadas

Node.js

Express.js

MongoDB

Mongoose

mongoose-paginate-v2

Handlebars

ES Modules

📦 Productos – API REST
🔹 GET /api/products

Permite obtener productos con paginación, filtros y ordenamiento mediante query params.

Query params disponibles:
Parámetro	Descripción
limit	Cantidad de productos por página (default: 10)
page	Página actual (default: 1)
sort	asc o desc (orden por precio)
query	Filtro por categoría o disponibilidad
Ejemplo:
GET /api/products?limit=5&page=2&sort=asc&query=electronics

Respuesta:
{
  "status": "success",
  "payload": [],
  "totalPages": 3,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?page=1",
  "nextLink": "/api/products?page=3"
}

🛒 Carritos – API REST
Endpoints implementados:
Método	Ruta	Descripción
POST	/api/carts	Crear carrito
GET	/api/carts/:cid	Obtener carrito con productos (populate)
POST	/api/carts/:cid/products/:pid	Agregar producto
PUT	/api/carts/:cid/products/:pid	Actualizar cantidad
DELETE	/api/carts/:cid/products/:pid	Eliminar producto
PUT	/api/carts/:cid	Reemplazar productos
DELETE	/api/carts/:cid	Vaciar carrito

📌 Los productos dentro del carrito referencian al modelo Product mediante ObjectId y se devuelven completos usando populate.

🖥️ Vistas (Handlebars)
/products

Lista de productos paginados

Botones de navegación

Botón “Agregar al carrito”

Acceso a detalle de producto

/products/:pid

Vista con detalle completo del producto

Información de precio, categoría y descripción

Botón para agregar al carrito

/carts/:cid

Vista de un carrito específico

Lista únicamente los productos del carrito

Muestra cantidad y datos del producto

🧪 Testing con Postman

El proyecto fue testeado manualmente con Postman, validando:

Paginación y filtros de productos

Ordenamiento por precio

Creación y gestión de carritos

Incremento de cantidades

Eliminación y limpieza de carritos

Correcto funcionamiento de populate

🧠 Decisiones Técnicas Clave

DAO separado para desacoplar lógica de negocio y persistencia

MongoDB + Mongoose para escalabilidad

populate para evitar duplicación de datos

mongoose-paginate-v2 para paginación profesional

Arquitectura preparada para autenticación futura

✅ Estado del Proyecto

✔ Entrega Final completada
✔ Requisitos cumplidos al 100%
✔ Código escalable y mantenible
✔ Listo para evaluación y defensa técnica

👨‍💻 Autor

Proyecto desarrollado como Entrega Final del curso de Backend, siguiendo buenas prácticas de arquitectura y diseño de APIs REST.