"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const Main_1 = require("../Main");
const Entity_1 = require("./Entity");
class Item extends Entity_1.Entity {
    type = "item";
    id;
    constructor(pos, id, uuid) {
        super();
        this.pos = pos;
        this.id = id;
        this.uuid = (0, Main_1.getUUID)();
    }
}
exports.Item = Item;
