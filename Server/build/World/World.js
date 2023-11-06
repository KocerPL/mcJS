"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
const Chunk_1 = require("./Chunk");
const fs = require("fs");
const Generator_1 = require("./Generator");
// class all about loading world, and changing , and generation
class World {
    dir;
    generator;
    loadedChunks = new Map();
    constructor(dir) {
        this.dir = dir;
        this.generator = new Generator_1.Generator();
    }
    getChunk(x, z) {
        if (this.loadedChunks.has(x + "-" + z))
            return this.loadedChunks.get(x + "-" + z);
        if (fs.existsSync(this.dir + "/world/" + x + "." + z + ".kChunk")) {
            let chunk = new Chunk_1.Chunk();
            chunk = JSON.parse(fs.readFileSync(this.dir + "/world/" + x + "." + z + ".kChunk").toString());
            //chunk.pos=[x,z];
            this.loadedChunks.set(x + "-" + z, chunk);
            return chunk;
        }
        let chunk = this.generator.generate(x, z);
        this.loadedChunks.set(x + "-" + z, chunk);
        return chunk;
    }
    saveChunk(chunk) {
        fs.writeFileSync(this.dir + "/world/" + chunk.pos[0] + "." + chunk.pos[1] + ".kChunk", JSON.stringify(chunk));
    }
    getSubchunk() {
    }
    static toSubIndex(x, y, z) {
        return x + (y * 16) + (z * 256);
    }
}
exports.World = World;
