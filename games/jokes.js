const { getRndInteger } = require("../utils");
const lod_ = require("lodash");

class Jokes {
  constructor(players, room, options) {
    this.room = room;
    this.players = lod_.cloneDeep(players);
    this.players_remainer = [];
    this.options = options;
    this.init();
  }

  init() {
    this.players.forEach((player) => {
      player.score = 0;
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
      data: { players: this.players, options: this.options },
    });
  }

  newSpeaker() {
    let rdm = getRndInteger(0, this.players_remainer.length - 1);
    let speaker_player = this.players_remainer[rdm];
    console.log("New speaker :" + speaker_player.name);

    this.players.forEach((player) => {
      if (player.id == speaker_player.id) {
        player.speaker = true;
        this.players_remainer = this.players_remainer.filter(
          (p) => p.id != player.id
        );

        if (this.players_remainer.length == 0) {
          this.players_remainer = lod_.cloneDeep(this.players);
        }
      } else {
        player.speaker = false;
      }
    });
  }

  newTurn() {
    this.newSpeaker();
    console.log(this.players);
    this.room.send({
      action: "GAME_action",
      code: this.room.code,
      game: "jokes",
      data: { action: "newTurn", players: this.players, options: this.options },
    });
  }

  stopTurn(message) {
    this.room.send({
      action: "GAME_action",
      code: this.room.code,
      game: "jokes",
      data: { action: "stopTurn", options: this.options },
    });

    if (message.reason == "loose") {
      let players = JSON.parse(message.players);
      players.forEach((player) => {
        let extra = JSON.parse(player.extra);
        if (extra.speaker) {
          let realPlayer = this.getPlayerByID(player.player.id);
          realPlayer.score += 1;
        }

        if (player.player.id == message.loose_id) {
          let realPlayer = this.getPlayerByID(player.player.id);
          realPlayer.score -= 1;
        }
      });
    }

    setTimeout(() => {
      this.newTurn();
    }, 2000);
  }

  resetSpeaker() {
    this.players.forEach((player) => {
      player.speaker = false;
    });
  }

  getPlayerByID(id) {
    return this.players.find((player) => player.id == id);
  }
}

module.exports = Jokes;
