import { CanvaManager } from "../Engine/CanvaManager.js";
import { EBO } from "../Engine/EBO.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { VAO } from "../Engine/VAO.js";
import { VBO } from "../Engine/VBO.js";
import { Main } from "../Main.js";
import { Block } from "./Block.js";
import { SubChunk } from "./SubChunk.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { Mesh } from "./Mesh.js";
import { World } from "./World.js";
import { randRange } from "../Engine/Utils/Math.js";
import { Lighter } from "../Lighter.js";
const gl = CanvaManager.gl;
export function flipDir(dir) {
    switch (dir) {
        case "POS_X": return "NEG_X";
        case "NEG_X": return "POS_X";
        case "POS_Z": return "NEG_Z";
        case "NEG_Z": return "POS_Z";
    }
}
export class Chunk {
    subchunks = new Array(16);
    heightmap = new Array(16);
    neighbours = {};
    allNeighbours = false;
    generated = true;
    generatingIndex = 0;
    sended = true;
    lazy = true;
    pos;
    mesh;
    vao;
    vbo;
    vtc;
    vlo;
    vfb;
    ebo;
    transformation = Matrix.identity();
    constructor(x, z) {
        this.transformation = this.transformation.translate(x * 16, 0, z * 16);
        this.mesh = new Mesh();
        this.vao = new VAO();
        this.vbo = new VBO();
        this.vao.addPtr(0, 3, 0, 0);
        this.vtc = new VBO();
        this.vao.addPtr(1, 3, 0, 0);
        this.vlo = new VBO();
        this.vao.addPtr(2, 1, 0, 0);
        this.vfb = new VBO();
        this.vao.addPtr(3, 1, 0, 0);
        this.ebo = new EBO();
        VAO.unbind();
        VBO.unbind();
        EBO.unbind();
        for (let i = 0; i < this.heightmap.length; i++) {
            this.heightmap[i] = [];
            for (let j = 0; j < this.heightmap.length; j++) {
                this.heightmap[i][j] = 0;
            }
        }
        this.pos = new Vector(x, 0, z);
    }
    updateLight() {
        if (!this.allNeighbours)
            return;
        this.emptyLightMaps();
        this.neighbours.NEG_X.emptyLightMaps();
        this.neighbours.POS_X.emptyLightMaps();
        this.neighbours.NEG_Z.emptyLightMaps();
        this.neighbours.POS_Z.emptyLightMaps();
        for (let i = 14; i > 0; i--) {
            this.neighbours.POS_X.onePassLight(i);
            this.neighbours.NEG_X.onePassLight(i);
            this.neighbours.POS_Z.onePassLight(i);
            this.neighbours.NEG_Z.onePassLight(i);
            this.onePassLight(i);
        }
    }
    emptyLightMaps() {
        for (let i = 0; i < 16; i++)
            this.subchunks[i].emptyLightMap();
    }
    onePassLight(currentPass) {
        for (let i = 0; i < 16; i++)
            this.subchunks[i].lightPass(currentPass);
    }
    preGenOne() {
        if (this.generatingIndex >= 16)
            return;
        this.subchunks[this.generatingIndex] = new SubChunk(new Vector(this.pos.x, this.generatingIndex, this.pos.z), this);
        this.subchunks[this.generatingIndex].preGenerate();
        this.generatingIndex++;
        if (this.generatingIndex >= 16) {
            this.generated = true;
        }
    }
    preGenSubchunks() {
        for (let i = 0; i < 16; i++) {
            this.subchunks[i] = new SubChunk(new Vector(this.pos.x, i, this.pos.z), this);
            this.subchunks[i].preGenerate();
        }
        this.generated = true;
    }
    postGenerate() {
        const x = randRange(0, 15) + (this.pos.x * 16);
        const z = randRange(0, 15) + (this.pos.z * 16);
        if (World.getHeight(x, z) < 150)
            World.generateTree(new Vector(x, World.getHeight(x, z), z));
    }
    updateNeighbour(neigbDir, chunk) {
        //console.log("what")
        //console.log(this.pos,neigbDir);
        if (chunk == undefined || this.allNeighbours)
            return;
        this.neighbours[neigbDir] = chunk;
        if (this.neighbours["NEG_X"] != undefined && this.neighbours["POS_X"] != undefined && this.neighbours["POS_Z"] != undefined && this.neighbours["NEG_Z"] != undefined) {
            console.log("gathered all neighbours :)");
            this.allNeighbours = true;
            this.updateAllSubchunks();
        }
    }
    sdNeighbour(neighbour, dir) {
        try {
            neighbour.updateNeighbour(dir, this);
            this.updateNeighbour(flipDir(dir), neighbour);
        }
        catch (error) { /* empty */ }
    }
    sendNeighbours() {
        if (this.allNeighbours || !this.generated)
            return;
        let neighbour = Main.getChunkAt(this.pos.x - 1, this.pos.z);
        this.sdNeighbour(neighbour, "POS_X");
        neighbour = Main.getChunkAt(this.pos.x + 1, this.pos.z);
        this.sdNeighbour(neighbour, "NEG_X");
        neighbour = Main.getChunkAt(this.pos.x, this.pos.z - 1);
        this.sdNeighbour(neighbour, "POS_Z");
        neighbour = Main.getChunkAt(this.pos.x, this.pos.z + 1);
        this.sdNeighbour(neighbour, "NEG_Z");
    }
    preUpdate(yPos) {
        for (let x = 0; x <= 15; x++)
            for (let z = 0; z <= 15; z++)
                for (let y = 255; y > 0; y--) {
                    if (this.getBlock(new Vector(x, y, z)).id > 0) {
                        this.heightmap[x][z] = y;
                        break;
                    }
                }
        for (const ls of this.subchunks[yPos].lightList) {
            Lighter.light(ls.x + (this.pos.x * 16), ls.y + (yPos * 16), ls.z + (this.pos.z * 16), 15);
        }
    }
    updateMesh() {
        this.mesh.reset();
        for (let i = 0; i < this.subchunks.length; i++) {
            this.mesh.add(this.subchunks[i].mesh);
        }
        this.vao.bind();
        this.vbo.bufferData(this.mesh.vertices);
        this.vlo.bufferData(this.mesh.lightLevels);
        this.vfb.bufferData(this.mesh.fb);
        this.vtc.bufferData(this.mesh.tCoords);
        this.ebo.bufferData(this.mesh.indices);
    }
    render() {
        if (this.allNeighbours) {
            this.vao.bind();
            Main.shader.loadTransformation(this.transformation);
            gl.drawElements(gl.TRIANGLES, this.mesh.count, gl.UNSIGNED_INT, 0);
        }
    }
    renderWater() {
        //TODO: Water rendering
    }
    getBlock(pos) {
        if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 15 || pos.y > 256 || pos.z > 15) {
            throw new Error("Incorrect cordinates: x:" + pos.x + " y:" + pos.y + " z:" + pos.z);
        }
        const y = pos.y % 16;
        const yPos = Math.floor(pos.y / 16);
        if (this.subchunks[yPos] != undefined) {
            if (!(this.subchunks[yPos].blocks[pos.x][y][pos.z] instanceof Block))
                this.subchunks[yPos].blocks[pos.x][y][pos.z] = new Block(0);
            //  console.log(this.subchunks[yPos].blocks[pos.x][y][pos.z]);
            return this.subchunks[yPos].blocks[pos.x][y][pos.z];
        }
        throw new Error("Undefined subchunk! ");
    }
    getBlockSub(pos) {
        if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 15 || pos.y > 256 || pos.z > 15) {
            throw new Error("Incorrect cordinates: x:" + pos.x + " y:" + pos.y + " z:" + pos.z);
        }
        const y = pos.y % 16;
        const yPos = Math.floor(pos.y / 16);
        if (this.subchunks[yPos] != undefined) {
            if (!(this.subchunks[yPos].blocks[pos.x][y][pos.z] instanceof Block))
                this.subchunks[yPos].blocks[pos.x][y][pos.z] = new Block(0);
            //  console.log(this.subchunks[yPos].blocks[pos.x][y][pos.z]);
            return { block: this.subchunks[yPos].blocks[pos.x][y][pos.z], sub: this.subchunks[yPos] };
        }
        throw new Error("Undefined subchunk! ");
    }
    setLight(pos, lightLevel) {
        if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 16) {
            throw new Error("Incorrect cordinates");
        }
        const y = pos.y % 16;
        const yPos = Math.floor(Math.round(pos.y) / 16);
        if (this.subchunks[yPos] != undefined) {
            if (!(this.subchunks[yPos].blocks[pos.x][y][pos.z] instanceof Block))
                this.subchunks[yPos].blocks[pos.x][y][pos.z] = new Block(0);
            this.subchunks[yPos].blocks[pos.x][y][pos.z].skyLight = lightLevel;
        }
        else {
            //   console.log("Subchunk is undefined");
        }
    }
    updateAllSubchunks() {
        for (const sub of this.subchunks)
            Main.toUpdate.add(sub);
        // console.log("now not lazy hehehehe")
    }
    getSubchunk(y) {
        const yPos = Math.floor(Math.round(y) / 16);
        if (this.subchunks[yPos] != undefined)
            return this.subchunks[yPos];
    }
    updateSubchunkAt(y) {
        if (!this.allNeighbours)
            return;
        const yPos = Math.floor(Math.round(y) / 16);
        Main.toUpdate.add(this.subchunks[yPos]);
    }
    setBlock(pos, blockID) {
        if (pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x > 16 || pos.y > 256 || pos.z > 16) {
            throw new Error("Incorrect cordinates");
        }
        const y = pos.y % 16;
        const yPos = Math.floor(Math.round(pos.y) / 16);
        if (this.subchunks[yPos] != undefined) //&& this.subchunks[yPos].generated==true)
         {
            if (!(this.subchunks[yPos].blocks[pos.x][y][pos.z] instanceof Block))
                this.subchunks[yPos].blocks[pos.x][y][pos.z] = new Block(0);
            this.subchunks[yPos].blocks[pos.x][y][pos.z].id = blockID;
            Main.toUpdate.add(this.subchunks[yPos]);
            try {
                // console.log("executing block update part")
                if (pos.x == 0) {
                    Main.toUpdate.add(this.neighbours["NEG_X"].subchunks[yPos]);
                }
                else if (pos.x == 15) {
                    Main.toUpdate.add(this.neighbours["POS_X"].subchunks[yPos]);
                }
                if (y == 0) {
                    Main.toUpdate.add(this.subchunks[yPos - 1]);
                }
                else if (y == 15) {
                    Main.toUpdate.add(this.subchunks[yPos + 1]);
                }
                if (pos.z == 0) {
                    Main.toUpdate.add(this.neighbours["NEG_Z"].subchunks[yPos]);
                }
                else if (pos.z == 15) {
                    Main.toUpdate.add(this.neighbours["POS_Z"].subchunks[yPos]);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
