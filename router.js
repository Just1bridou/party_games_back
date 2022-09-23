const messageActions = require("./messageActions");
const { MessageActions } = require("./messageActions");
const RManager = require("./server/RoomsManager");

const RoomsManager = new RManager();
const mActions = new messageActions(RoomsManager);

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
          mActions.roomCreate(request, connection, message);
          break;

        case "ROOM_join":
          console.log("WS: Join room");
          mActions.roomJoin(request, connection, message);
          break;

        case "refreshPlayersList":
          console.log("WS: Refresh players list");
          mActions.refreshPlayersList(message);
          break;

        case "START_GAME":
          console.log("WS: Start game");
          mActions.startGame(message);
          break;

        case "GAME_ACTION":
          mActions.gameAction(message);
          break;
      }
    });

    connection.on("close", (evt) => {
      console.log("disconnected");
      let player = RoomsManager.getConnection(connection);
      if (player) {
        RoomsManager.garbageCollector(player.code);
      }
    });
  });
}

module.exports = {
  openRoutes: openRoutes,
};
