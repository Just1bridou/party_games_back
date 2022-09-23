const { getRndInteger } = require("../utils");
const lod_ = require("lodash");

class CardsPicker {
  constructor(players, room, options) {
    this.room = room;
    this.players = lod_.cloneDeep(players);
    this.cards = this.loadCards();
    this.cards_sorted = [];
    this.cards_reminder = [];
    this.options = options;
    this.init();
  }

  loadCards() {
    return [];
  }

  init() {
    this.players.forEach((player) => {
      player.score = 0;
      delete player.connection;
    });

    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 13; j++) {
        this.cards.push({ id: i + "_" + j, color: i, value: j });
      }
    }

    this.cards_reminder = lod_.cloneDeep(this.cards);
    this.startGame();
  }

  drawCard() {
    let rdm = getRndInteger(0, this.cards_reminder.length - 1);
    let card = this.cards_reminder[rdm];
    this.cards_reminder = this.cards_reminder.filter((c) => c.id != card.id);
    this.cards_sorted = [...this.cards_sorted, card];

    this.room.send({
      action: "GAME_action",
      code: this.room.code,
      game: "cards_picker",
      data: {
        action: "draw",
        players: this.players,
        cards: this.cards,
        cards_sorted: this.cards_sorted,
        cards_reminder: this.cards_reminder,
        options: this.options,
        card: card,
      },
    });
  }

  startGame() {
    this.room.send({
      action: "START_GAME",
      code: this.room.code,
      game: "cards_picker",
      data: {
        players: this.players,
        cards: this.cards,
        cards_sorted: this.cards_sorted,
        cards_reminder: this.cards_reminder,
        options: this.options,
      },
    });
  }

  getPlayerByID(id) {
    return this.players.find((player) => player.id == id);
  }
}

module.exports = CardsPicker;
