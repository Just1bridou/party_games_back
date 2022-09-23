const RManager = require("./server/RoomsManager");
const PlayerInstance = require("./server/Player");
const Jokes = require("./games/jokes");

// let Room = RoomsManager.newRoom();
// Room.code = "a";
// let Player = new PlayerInstance("1", null, "bot", "a", false);
// Room.addPlayer(Player);

// setTimeout(() => {
//   Room.startGame("jokes");
// }, 15000);

module.exports = class MessageActions {
  constructor(RoomsManager) {
    this.roomsManager = RoomsManager;
  }

  /**
   * Create new room
   * @param {*} request
   * @param {*} connection
   * @param {*} message
   */
  roomCreate(request, connection, message) {
    console.log(this.ro);
    let Room = this.roomsManager.newRoom();
    let Player = new PlayerInstance(connection, message.name, Room.code, true);
    this.roomsManager.newConnection(connection, Player);
    Room.addPlayer(Player);

    // let Player1 = new PlayerInstance(null, "Nicolas", message.name, false);
    // let Player2 = new PlayerInstance(null, "Simon", message.name, false);

    // Room.addPlayer(Player1);
    // Room.addPlayer(Player2);

    Player.send({ action: "ROOM_create" });
    Room.sendPlayersList();
  }
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

    let Room = this.roomsManager.getRoom(message.code);

    if (Room) {
      let Player = new PlayerInstance(connection, message.name, message.code);
      this.roomsManager.newConnection(connection, Player);

      Room.addPlayer(Player);
      Player.send({ action: "ROOM_join" });
      Room.sendPlayersList();
    } else {
      connection.sendUTF(JSON.stringify({ error: "No room found" }));
    }
  }

  /**
   * Refresh players list
   * @param {*} message
   */
  refreshPlayersList(message) {
    let Room = this.roomsManager.getRoom(message.code);
    if (Room) Room.sendPlayersList();
  }

  startGame(message) {
    let Room = this.roomsManager.getRoom(message.ROOM_code);
    if (Room) Room.startGame(message.GAME_code, message.GAME_options);
  }

  gameAction(message) {
    let Room = this.roomsManager.getRoom(message.ROOM_code);

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

      case "cards_picker":
        switch (message.GAME_action) {
          case "draw":
            Room.game.drawCard();
            break;
        }
        break;
    }
  }
};

// module.exports = {
//   MessageActions: new MessageActions().getActions(),
// };
