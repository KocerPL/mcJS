import { Vector } from "../../Engine/Utils/Vector.js";
import { SubChunk } from "./SubChunk.js";
export class Chunk {
    pos = new Vector(0, 0, 0);
    heightmap = new Array(256);
    subchunks = new Array(16);
    constructor(pos) {
        this.pos = pos;
    }
    generate() {
        for (let i = 0; i < this.subchunks.length; i++) {
            this.subchunks[i] = new SubChunk(new Vector(this.pos.x, i, this.pos.z));
            for (let y = 0; y < 16; y++)
                for (let x = 0; x < 16; x++)
                    for (let z = 0; z < 16; z++) {
                        const index = x + (y * 16) + (z * 256);
                        if (y + (i * 16) < 130)
                            this.subchunks[i].blocks[index] = 1;
                        else if (y + (i * 16) == 130)
                            this.subchunks[i].blocks[index] = 2;
                        else
                            this.subchunks[i].blocks[index] = 0;
                        /*   if(y%(x%3)==0)
                this.subchunks[i].blocks[index] = 1;
                else
                this.subchunks[i].blocks[index] = 0;
                this.subchunks[i].lightMap[index] = 0;*/
                    }
        }
        this.calcHeightmap();
    }
    calcHeightmap() {
        for (let i = 0; i < this.subchunks.length; i++) {
            for (let y = 0; y < 16; y++)
                for (let x = 0; x < 16; x++)
                    for (let z = 0; z < 16; z++) {
                        const index = x + (y * 16) + (z * 256);
                        if (this.subchunks[i].blocks[index] > 0 && (this.heightmap[x + (z * 16)]) < y + (i * 16))
                            this.heightmap[x + (z * 16)] = y + (i * 16);
                    }
        }
    }
}
