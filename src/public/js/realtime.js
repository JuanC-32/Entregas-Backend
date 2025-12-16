const socket = io();
const list = document.getElementById("list");
const form = document.getElementById("form");

socket.on("products", products => {
  list.innerHTML = products.map(p =>
    `<li>${p.title} <button onclick="del('${p.id}')">X</button></li>`
  ).join("");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  socket.emit("addProduct", { title: form.title.value });
  form.reset();
});

function del(id) {
  socket.emit("deleteProduct", id);
}
