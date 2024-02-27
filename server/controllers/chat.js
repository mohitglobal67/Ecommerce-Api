// index.js
const express = require('express');
const http = require('http');
const { HubConnectionBuilder } = require('@microsoft/signalr');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const hubConnection = new HubConnectionBuilder()
  .withUrl('http://localhost:3000/chatHub')
  .build();

hubConnection.on('ReceiveMessage', (user, message) => {
  console.log(`${user}: ${message}`);
});

app.post('/api/sendMessage', (req, res) => {
  const { user, message } = req.body;
  hubConnection.invoke('SendMessage', user, message)
    .catch(err => console.error(err));
  res.sendStatus(200);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
