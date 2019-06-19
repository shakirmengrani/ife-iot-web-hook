// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const expressWs = require('express-ws')(app);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(bodyParser.json())

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/hook", function(request, response){
  let q = request.query;
  let c = expressWs.getWss("/" + q.topic)
  c.clients.forEach((client) => {
    client.send(JSON.stringify(request.body));
  });
  response.json(request.body);
});

app.ws('/candle', function(ws, req) {
  ws.on('message', function(msg) {
    console.log("client message: ", msg);
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


