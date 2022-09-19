const messageActions = require("./messageActions");
const { MessageActions } = require("./messageActions");

function openRoutes(wsServer) {
  wsServer.on("request", function (request) {
    console.log("New request on ws");

    var connection = request.accept(null, request.origin);
    connection.sendUTF(JSON.stringify({ action: "connect" }));

    connection.on("message", function (data) {
      var message = {};
      try {
        message = JSON.parse(data.utf8Data);
      } catch {
        message = {};
      }

      console.log("WS: New message");
      console.log(message);

      /**
       * Router for websockets
       */
      switch (message.action) {
        case "ROOM_create":
          console.log("WS: Create new room");
          MessageActions.roomCreate(request, connection, message);
          break;

        case "ROOM_join":
          console.log("WS: Join room");
          MessageActions.roomJoin(request, connection, message);
          break;

        case "refreshPlayersList":
          console.log("WS: Refresh players list");
          MessageActions.refreshPlayersList(message);
          break;

        case "START_GAME":
          console.log("WS: Start game");
          MessageActions.startGame(message);
          break;

        case "GAME_ACTION":
          MessageActions.gameAction(message);
          break;
      }
    });

    connection.on("close", function (connection) {
      console.log("disconnected");
      // TODO
    });
  });
}

module.exports = {
  openRoutes: openRoutes,
};
