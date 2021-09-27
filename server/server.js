const WebSocket = require('ws');
const express = require('express');
const PORT = 3001;
const { API_KEY } = require('../finnhub-api.js');

const app = express();

app.use(express.static('public'));
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

// Connection opened -> Subscribe
socket.addEventListener('open', function (event) {
  setInterval(() => socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AMZN'})), 3000);
    // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
    //socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
    //socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
});

// Listen for messages
socket.addEventListener('message', function (event) {
  app.get('/liveData', (req, res) => {
    res.status(200).send(event.data);
  })
  console.log('Message from server ', event.data);
});

// Unsubscribe
 var unsubscribe = function(symbol) {
    socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
}

app.listen(PORT, () => {
  console.log("Listening on 3001");
})