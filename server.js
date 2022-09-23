const dotenv = require("dotenv");
dotenv.config();

const webSocketsServerPort = process.env.SOCKET_PORT;
const webSocketServer = require("websocket").server;
const http = require("http");
const axios = require("axios").default;

const { openRoutes } = require("./router");

const server = http.createServer(function (request, response) {});

server.listen(webSocketsServerPort, function () {
  console.log("WS Server is listening on port " + webSocketsServerPort);
});

const wsServer = new webSocketServer({ httpServer: server });
/**
 * Open routes from router
 */
openRoutes(wsServer);

// function getRoom(code) {
//     for(let room of roomsList) {
//         if(room.code == code) {
//             return room
//         }
//     }
// }

// Node JS

let express = require("express");

let app = express();
let serverNode = http.Server(app);

app.get("/cards/:id", (req, res) => {
  console.log(req.params.id);
  res.sendFile(__dirname + "/games/cards/" + req.params.id + ".png");
});

serverNode.listen(process.env.PORT);
console.log("Express server is listening on port " + process.env.PORT);
