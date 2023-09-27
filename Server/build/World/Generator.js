"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const Chunk_1 = require("./Chunk");
class Generator {
    WorldSeed = 6969696969696969;
    generate() {
        return new Chunk_1.Chunk();
    }
}
exports.Generator = Generator;
