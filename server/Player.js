const { getRndInteger } = require("../utils");
const { uuid } = require("uuidv4");

class Player {
  constructor(connection, name, code, admin = false) {
    this.id = uuid();
    this.connection = connection;
    this.name = name.trim() != "" ? name : "name_" + getRndInteger(1000, 9999);
    this.code = code;
    this.admin = admin;
    this.score = 0;
    this.avatar =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/OOjs_UI_icon_userAvatar-constructive.svg/1200px-OOjs_UI_icon_userAvatar-constructive.svg.png";
    console.log("New player : " + this.name);
    this.save();
  }

  send(message) {
    if (!this.connection) return;
    this.connection.sendUTF(JSON.stringify(message));
  }

  save() {
    console.log({ action: "savePlayer", player: this.shortPlayer() });
    this.send({ action: "savePlayer", player: this.shortPlayer() });
  }

  shortPlayer() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      code: this.code,
      admin: this.admin,
    };
  }
}

module.exports = Player;

// TODO: Check nickname
