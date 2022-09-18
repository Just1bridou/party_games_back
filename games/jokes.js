const { getRndInteger } = require("../utils");
const lod_ = require("lodash");

class Jokes {
  constructor(players, room) {
    this.room = room;
    this.players = lod_.cloneDeep(players);
    this.players_remainer = [];
    this.init();
  }

  init() {
    this.players.forEach((player) => {
      delete player.connection;
    });

    this.players_remainer = lod_.cloneDeep(this.players);
    this.listenSocketsEvents();
    this.newSpeaker();
    this.startGame();
  }

  listenSocketsEvents() {}

  startGame() {
    this.room.send({
      action: "START_GAME",
      code: this.room.code,
      game: "jokes",
      data: { players: this.players },
    });
  }

  newSpeaker() {
    let rdm = getRndInteger(0, this.players_remainer.length - 1);
    let speaker_player = this.players[rdm];

    this.players.forEach((player) => {
      if (player == speaker_player) {
        player.speaker = true;
        this.players_remainer = this.players_remainer.filter(
          (p) => p.id != player.id
        );
      } else {
        player.speaker = false;
      }
    });
  }

  resetSpeaker() {
    this.players.forEach((player) => {
      player.speaker = false;
    });
  }
}

module.exports = Jokes;
