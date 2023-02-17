import { Chunk } from "./WorldBuilder/Chunk.js";
import { Vector } from "../Engine/Utils/Vector.js";
addEventListener('message', e => {
    if (e.data == "start")
        Main.run();
});
var settings = {
    maxChunks: 120
};
class Main {
    static run() {
        postMessage({ type: "console", msg: "Starting server in separated thread!!" });
        let step = 1;
        let iter = 1;
        let k = 0;
        let nextCoords = new Vector(0, 0, 0);
        let chunk = new Chunk(new Vector(nextCoords.x, 0, nextCoords.z));
        chunk.generate();
        for (let i = 0; i < 16; i++)
            this.sendSubChunk(chunk.subchunks[i]);
        this.sendChunkReady(new Vector(nextCoords.x, 0, nextCoords.z));
        postMessage({ type: "console", msg: "Chunks ready!!" });
        while (k < 10) {
            for (let i = 0; i < iter; i++) {
                nextCoords.x += step;
                let chunk = new Chunk(new Vector(nextCoords.x, 0, nextCoords.z));
                chunk.generate();
                for (let i = 0; i < 16; i++)
                    this.sendSubChunk(chunk.subchunks[i]);
                this.sendChunkReady(new Vector(nextCoords.x, 0, nextCoords.z));
                postMessage({ type: "console", msg: "Chunks ready!!" });
                k++;
            }
            for (let i = 0; i < iter; i++) {
                nextCoords.z += step;
                let chunk = new Chunk(new Vector(nextCoords.x, 0, nextCoords.z));
                chunk.generate();
                for (let i = 0; i < 16; i++)
                    this.sendSubChunk(chunk.subchunks[i]);
                this.sendChunkReady(new Vector(nextCoords.x, 0, nextCoords.z));
                postMessage({ type: "console", msg: "Chunks ready!!" });
                k++;
            }
            iter++;
            step = -step;
        }
        postMessage({ type: "console", msg: "Ready" });
    }
    static sendSubChunk(subchunk) {
        postMessage({ type: "subchunk", blocks: subchunk.blocks, subX: subchunk.pos.x, subZ: subchunk.pos.z, subY: subchunk.pos.y });
    }
    static sendChunkReady(pos) {
        postMessage({ type: "chunkReady", chunkX: pos.x, chunkZ: pos.z });
    }
}
