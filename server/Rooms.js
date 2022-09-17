class Room {
  constructor() {
    this.code = this.generateRoomToken();
    this.players = [];
    this.POSITION_UPDATE_TIME = 10000;
    this.state = "waiting";
  }

  addPlayer(player) {
    this.players.push(player);
    player.code = this.code;
  }

  generateRoomToken() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  send(message) {
    this.players.forEach((player) => {
      console.log("Send to " + player.name + " : " + JSON.stringify(message));
      player.send(message);
    });
  }

  sendPlayersList() {
    this.send({ action: "refreshPlayersList", players: this.shortPlayer() });
  }

  shortPlayer() {
    return this.players.map((player) => {
      return player.shortPlayer();
    });
  }

  startGame(gameCode) {
    this.send({ action: "START_GAME", game: gameCode });
  }
}

module.exports = Room;
