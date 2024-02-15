const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// Inicializa Firebase Admin con tus credenciales
const serviceAccount = require('./config/chatapp-aa8a0-firebase-adminsdk-92cuf-3221e4effb.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes POST a JSON

app.get('/', (req, res) => {
  res.send('API Movizzon está corriendo.');
});

// ... otros endpoints ...

// Endpoint para listar usuarios
app.get('/api/list-users', async (req, res) => {
  // Aquí deberías implementar tu lógica de autenticación y autorización
  // Por ejemplo, verificar un token de autenticación de Firebase
  // if (!req.headers.authorization || !tuFuncionDeVerificacion(req.headers.authorization)) {
  //   return res.status(403).send('No autorizado');
  // }

  try {
    // Lista los primeros 1000 usuarios (ajusta este número según tus necesidades)
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
    }));

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(`Error al listar los usuarios: ${error.message}`);
  }
});

// ... otros endpoints ...

// Endpoint para enviar mensajes al chat
app.post('/api/send-message', (req, res) => {
  const { message, userId = "defaultUserId", avatar = "https://i.pravatar.cc/300", imageUrl } = req.body;

  // Verifica si se proporcionó al menos un mensaje o una URL de imagen
  if (!message && !imageUrl) {
    return res.status(400).send('No se proporcionó un mensaje o una URL de imagen.');
  }

  const db = admin.firestore();
  
  // Construye el objeto del mensaje con la información proporcionada
  const messageData = {
    text: message || '', // Asegura que el texto sea una cadena vacía si no se proporciona
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    user: {
      _id: userId,
      avatar: avatar,
    },
    ...(imageUrl && { image: imageUrl }), // Añade el campo image solo si imageUrl está presente
  };

  // Añade el mensaje a la colección 'messages'
  db.collection('messages').add(messageData)
    .then(() => res.status(200).send('Mensaje enviado con éxito.'))
    .catch((error) => res.status(500).send(`Error al enviar el mensaje: ${error.message}`));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});