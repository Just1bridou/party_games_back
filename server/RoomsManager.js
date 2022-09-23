const RoomInstance = require("./Rooms");

class RoomsManager {
  constructor() {
    this.rooms = [];
    this.connections = [];
  }

  newConnection(connection, player) {
    this.connections[connection] = player;
  }

  getConnection(connection) {
    return this.connections[connection];
  }

  garbageCollector(code) {
    let room = this.getRoom(code);
    if (room) {
      if (room.players.length === 0) {
        this.rooms.splice(this.rooms.indexOf(room), 1);
      }
    }
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
