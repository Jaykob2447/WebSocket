const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { Message } = require('./models');

const PORT = process.env.PORT ?? 5000;

const httpServer = http.createServer(app);

// ----------------
const cors = { origin: '*' };
const wsServer = new Server(httpServer, { cors });

wsServer.on('connection', socket => {
  console.log('Connection established');

  socket.on('NEW_MESSAGE', async payload => {
    try {
      // закинути повідомлення в базу
      const createdMessage = await Message.create(payload);
      // успіх - відправити повідомлення всім
      wsServer.emit('NEW_MESSAGE_SUCCESS', createdMessage);
    } catch (error) {
      // помилка - відправити помилку собі
      socket.emit('NEW_MESSAGE_ERROR', error);
    }
  });
});

// --------------

httpServer.listen(PORT, () => {
  console.log(`Server is running!`);
});
