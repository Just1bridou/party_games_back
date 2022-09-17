const RoomInstance = require("./Rooms");

class RoomsManager {
  constructor() {
    this.rooms = [];
  }

  newRoom() {
    var room = new RoomInstance();
    this.rooms.push(room);
    return room;
  }

  getRoom(code) {
    return this.rooms.find((room) => room.code === code);
  }
}

module.exports = RoomsManager;
