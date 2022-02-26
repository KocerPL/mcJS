import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
export class World {
    Chunks = new Array();
    static heightMap = new Array(256);
    static init() {
        this.genHeightMap();
    }
    static genHeightMap() {
        let height = 20;
        let height2 = 20;
        for (let x = 0; x < 256; x++) {
            if (x % 4)
                height += Math.round(Math.random() * 2) - 1;
            this.heightMap[x] = new Array();
            for (let z = 0; z < 256; z++) {
                try {
                    if (z != 0) {
                        height2 = Math.round((Math.random() * 2) - 1) + this.heightMap[x][z - 1];
                        while (height2 > this.heightMap[x - 1][z] + 1) {
                            height2 -= 1;
                        }
                        while (height2 < this.heightMap[x - 1][z] - 1) {
                            height2 += 1;
                        }
                    }
                    else
                        height2 = height;
                }
                catch (error) {
                }
                this.heightMap[x][z] = height2;
            }
        }
    }
    static setLight(blockPos, lightLevel) {
        try {
            let inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
            let chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
            Main.chunks[chunkPos.x][chunkPos.z].setLight(inChunkPos, lightLevel);
            let sc = Main.chunks[chunkPos.x][chunkPos.z].getSubchunk(blockPos.y);
            if (!sc.lightUpdate) {
                sc.lightUpdate = true;
                console.log("okokokok");
                sc.updateVerticesIndices(9, Main.chunks[chunkPos.x][chunkPos.z].heightmap);
            }
            return Main.chunks[chunkPos.x][chunkPos.z];
        }
        catch (error) {
            console.log(error);
        }
    }
    static setBlock(blockPos, type) {
        let inChunkPos = new Vector(Math.round(Math.round(blockPos.x) % 16), Math.round(blockPos.y), Math.round(Math.round(blockPos.z) % 16));
        let chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        Main.chunks[chunkPos.x][chunkPos.z].setBlock(inChunkPos, type);
        try {
            if (type < 1) {
                if (inChunkPos.y >= Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z]) {
                    //console.log("if");
                    let lightLevel = 15;
                    let yPos = blockPos.y;
                    while (this.getBlock(new Vector(blockPos.x, yPos, blockPos.z)).id == 0 && lightLevel > 0) {
                        //  console.log("while");
                        lightLevel--;
                        this.setLight(new Vector(blockPos.x, yPos - 1, blockPos.z), lightLevel);
                        this.setLight(new Vector(blockPos.x + 1, yPos, blockPos.z), lightLevel);
                        this.setLight(new Vector(blockPos.x - 1, yPos, blockPos.z), lightLevel);
                        this.setLight(new Vector(blockPos.x, yPos, blockPos.z + 1), lightLevel);
                        this.setLight(new Vector(blockPos.x, yPos, blockPos.z - 1), lightLevel);
                        yPos--;
                    }
                    Main.chunks[chunkPos.x][chunkPos.z].heightmap[inChunkPos.x][inChunkPos.z] = yPos - 1;
                    if (Main.chunks[chunkPos.x][chunkPos.z].getSubchunk(blockPos.y).generated)
                        Main.chunks[chunkPos.x][chunkPos.z].updateSubchunkAt(blockPos.y);
                    if (Main.chunks[chunkPos.x][chunkPos.z].getSubchunk(blockPos.y).generated)
                        Main.chunks[chunkPos.x][chunkPos.z].updateSubchunkAt(yPos);
                }
                else {
                    let lightLevel = Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos).lightLevel - 1;
                    if (lightLevel > 1) {
                        this.lightFunc(new Vector(blockPos.x, blockPos.y - 1, blockPos.z), lightLevel);
                        this.lightFunc(new Vector(blockPos.x, blockPos.y + 1, blockPos.z), lightLevel);
                        this.lightFunc(new Vector(blockPos.x + 1, blockPos.y, blockPos.z), lightLevel);
                        this.lightFunc(new Vector(blockPos.x - 1, blockPos.y, blockPos.z), lightLevel);
                        this.lightFunc(new Vector(blockPos.x, blockPos.y, blockPos.z + 1), lightLevel);
                        this.lightFunc(new Vector(blockPos.x, blockPos.y, blockPos.z - 1), lightLevel);
                    }
                }
            }
            else {
                console.log("ok");
                let lightLevel = 15;
                this.lightFunc(blockPos, lightLevel);
                this.lightFunc(new Vector(blockPos.x, blockPos.y - 1, blockPos.z), lightLevel);
                this.lightFunc(new Vector(blockPos.x, blockPos.y + 1, blockPos.z), lightLevel);
                this.lightFunc(new Vector(blockPos.x + 1, blockPos.y, blockPos.z), lightLevel);
                this.lightFunc(new Vector(blockPos.x - 1, blockPos.y, blockPos.z), lightLevel);
                this.lightFunc(new Vector(blockPos.x, blockPos.y, blockPos.z + 1), lightLevel);
                this.lightFunc(new Vector(blockPos.x, blockPos.y, blockPos.z - 1), lightLevel);
            }
        }
        catch (error) {
            return;
        }
        try {
        }
        catch (error) {
        }
        return;
    }
    static lightFunc(vec, lightLevel) {
        if (this.getBlock(vec).lightLevel < lightLevel)
            this.setLight(vec, lightLevel);
    }
    static getBlock(blockPos) {
        let inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
        let chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
        try {
            return Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos);
        }
        catch (error) {
            console.log(inChunkPos);
            console.error(error);
        }
    }
    static getHeight(x, z) {
        try {
            return this.heightMap[x][z];
        }
        catch (error) { }
        return 0;
    }
}
