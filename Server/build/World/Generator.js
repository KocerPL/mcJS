"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const Main_1 = require("../Main");
const Chunk_1 = require("./Chunk");
class Generator {
    WorldSeed = 6969696969696969;
    generate() {
        let chunk = new Chunk_1.Chunk();
        chunk.subchunks = new Array(16);
        for (let i = 0; i < 16; i++) {
            let sub = new Array(4096);
            for (let x = 0; x < 16; x++)
                for (let y = 0; y < 16; y++)
                    for (let z = 0; z < 16; z++)
                        if (y + (i * 16) == 64)
                            sub[(0, Main_1.toIndex)(x, y, z)] = 1;
                        else if (y + (i * 16) < 64)
                            sub[(0, Main_1.toIndex)(x, y, z)] = 1;
                        else
                            sub[(0, Main_1.toIndex)(x, y, z)] = 0;
            chunk.subchunks[i] = sub;
        }
        return chunk;
    }
}
exports.Generator = Generator;
