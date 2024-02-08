const express = require('express');
const app = express();

// Ruta raíz que muestra un mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('API Movizzon está corriendo.');
});

// Nuevo endpoint que devuelve un mensaje de chat con texto e imagen
app.get('/api/message', (req, res) => {
  const chatMessage = {
    text: "Producto temporalmente sin stock",
    imageUrl: "https://www.adslzone.net/app/uploads-adslzone.net/2019/04/borrar-fondo-imagen.jpg"
  };
  res.json(chatMessage);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});