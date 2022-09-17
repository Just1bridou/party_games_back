const dotenv = require("dotenv");
dotenv.config();

const webSocketsServerPort = process.env.SOCKET_PORT;
const webSocketServer = require("websocket").server;
const http = require("http");
const axios = require("axios").default;

const { openRoutes } = require("./router");

const server = http.createServer(function (request, response) {});

server.listen(webSocketsServerPort, function () {
  console.log("Server is listening on port " + webSocketsServerPort);
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

// let express = require("express");
// let socketio = require("socket.io");

// let app = express();
// let serverNode = http.Server(app);
// let io = socketio(serverNode);

// app.use("/css", express.static(__dirname));
// app.use("/js", express.static(__dirname));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// io.on("connect", (socket) => {
//   socket.on("reloadQuestions", (data) => {
//     socket.emit("reloadQuestions", questions);
//   });

//   socket.on("getAllRooms", (data) => {
//     let count = 0;

//     for (let room of roomsList) {
//       count += room.playerList.length;
//     }

//     socket.emit("getAllRooms", { rooms: roomsList.length, players: count });
//   });

//   socket.on("addQuestion", (data) => {
//     questionsFile.append("questions", data);
//     questionsFile.save();
//     //questions = questionsFile.toObject()
//     socket.emit("reloadQuestions", questions);
//   });

//   socket.on("removeQuestion", (nb) => {
//     questionsFile.get("questions").splice(nb, 1);
//     questionsFile.save();
//     socket.emit("reloadQuestions", questions);
//   });
// });

// serverNode.listen(process.env.PORT);
