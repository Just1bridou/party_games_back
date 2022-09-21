const RManager = require("./server/RoomsManager");
const PlayerInstance = require("./server/Player");
const Jokes = require("./games/jokes");
const RoomsManager = new RManager();

// let Room = RoomsManager.newRoom();
// Room.code = "a";
// let Player = new PlayerInstance("1", null, "bot", "a", false);
// Room.addPlayer(Player);

// setTimeout(() => {
//   Room.startGame("jokes");
// }, 15000);

class MessageActions {
  actions = {
    /**
     * Create new room
     * @param {*} request
     * @param {*} connection
     * @param {*} message
     */
    roomCreate(request, connection, message) {
      let Room = RoomsManager.newRoom();
      let Player = new PlayerInstance(
        connection,
        message.name,
        Room.code,
        true
      );
      Room.addPlayer(Player);

      // let Player1 = new PlayerInstance(null, "bot1", message.name, false);
      // let Player2 = new PlayerInstance(null, "bot2", message.name, false);

      // Room.addPlayer(Player1);
      // Room.addPlayer(Player2);

      Player.send({ action: "ROOM_create" });
      Room.sendPlayersList();
    },
    /**
     * Join room
     * @param {*} request
     * @param {*} connection
     * @param {*} message
     * @returns
     */
    roomJoin(request, connection, message) {
      if (!message.code) {
        return;
      }

      let Room = RoomsManager.getRoom(message.code);

      if (Room) {
        let Player = new PlayerInstance(connection, message.name, message.code);
        Room.addPlayer(Player);
        Player.send({ action: "ROOM_join" });
        Room.sendPlayersList();
      } else {
        connection.sendUTF(JSON.stringify({ error: "No room found" }));
      }
    },

    /**
     * Refresh players list
     * @param {*} message
     */
    refreshPlayersList(message) {
      let Room = RoomsManager.getRoom(message.code);
      if (Room) Room.sendPlayersList();
    },
    startGame(message) {
      let Room = RoomsManager.getRoom(message.ROOM_code);
      if (Room) Room.startGame(message.GAME_code, message.GAME_options);
    },
    gameAction(message) {
      let Room = RoomsManager.getRoom(message.ROOM_code);

      switch (message.GAME_code) {
        case "jokes":
          switch (message.GAME_action) {
            case "switch":
              Room.game.newTurn();
              break;
            case "stopTurn":
              Room.game.stopTurn(message);
              break;
          }
          break;
      }
    },
  };

  getActions() {
    return this.actions;
  }
}

module.exports = {
  MessageActions: new MessageActions().getActions(),
};
