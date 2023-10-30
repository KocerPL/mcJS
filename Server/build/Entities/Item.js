"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const Entity_1 = require("./Entity");
class Item extends Entity_1.Entity {
    type = "item";
    id;
    constructor(pos, id) {
        super();
        this.pos = pos;
        this.id = id;
    }
}
exports.Item = Item;
