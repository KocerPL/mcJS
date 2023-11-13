import { Array3D } from "../Engine/Utils/Array3D.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Block, blockType, Side } from "./Block.js";
import { Mesh } from "./Mesh.js";
import { Texture } from "../Engine/Texture.js";
export class SubChunk {
    mesh = new Mesh(); //Mesh that contains all data needed for rendering  
    tmpMesh = new Mesh();
    blocks = new Array3D(16, 16, 16); //Array of blocks
    generated = true; //Is SubChunk already generated
    lightUpdate = false; //Is subchunk updating light
    // empty:boolean = true;    //Is subchunk empty
    fPass = true;
    lightList = [];
    chunk; //parent Chunk of this subchunk
    pos; //subchunk position in world
    constructor(pos, chunk) {
        //Setting up variables
        this.pos = pos;
        this.chunk = chunk;
        //   this.emptyLightMap();
    }
    //Subchunk update
    scanLight() {
        this.lightList = [];
        for (let i = 0; i < 16; i++)
            for (let j = 0; j < 16; j++)
                for (let k = 0; k < 16; k++) {
                    if (this.blocks[i][j][k] && Block.info[this.blocks[i][j][k].id].glowing)
                        this.lightList.push(new Vector(i, j, k));
                }
    }
    async update(gs) {
        // this.chunk.updateLight();
        this.scanLight();
        await this.chunk.preUpdate(this.pos.y, gs);
        //this.mesh.reset();
        this.tmpMesh = new Mesh();
        await this.updateVerticesOptimized(); //.then(()=>{
        this.mesh = this.tmpMesh;
        this.mesh.count = this.mesh.indices.length;
        this.lightUpdate = false;
        //resolve();
        //});
    }
    getBlock(pos) {
        if (pos.x > -1 && pos.x < 16 && pos.y > -1 && pos.y < 16 && pos.z > -1 && pos.z < 16) {
            return this.blocks[pos.x][pos.y][pos.z];
        }
        try {
            if (pos.y < 0)
                return this.chunk.subchunks[this.pos.y - 1].getBlock(new Vector(pos.x, pos.y + 16, pos.z));
            if (pos.y > 15)
                return this.chunk.subchunks[this.pos.y + 1].getBlock(new Vector(pos.x, pos.y - 16, pos.z));
            if (pos.x < 0)
                return this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].getBlock(new Vector(pos.x + 16, pos.y, pos.z));
            if (pos.x > 15)
                return this.chunk.neighbours["POS_X"].subchunks[this.pos.y].getBlock(new Vector(pos.x - 16, pos.y, pos.z));
            if (pos.z < 0)
                return this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].getBlock(new Vector(pos.x, pos.y, pos.z + 16));
            if (pos.z > 15)
                return this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].getBlock(new Vector(pos.x, pos.y, pos.z - 16));
        }
        catch (error) {
            // console.log("Cannot get block of next subchunk!!",transPos);
        }
        return undefined;
    }
    getBlockInside(x, y, z) {
        return this.blocks[x][y][z];
    }
    getBlockWV(x, y, z) {
        if (x > -1 && x < 16 && y > -1 && y < 16 && z > -1 && z < 16) {
            return this.blocks[x][y][z];
        }
        try {
            if (y < 0)
                return this.chunk.subchunks[this.pos.y - 1].getBlockInside(x, y + 16, z);
            if (y > 15)
                return this.chunk.subchunks[this.pos.y + 1].getBlockInside(x, y - 16, z);
            if (x < 0)
                return this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].getBlockInside(x + 16, y, z);
            if (x > 15)
                return this.chunk.neighbours["POS_X"].subchunks[this.pos.y].getBlockInside(x - 16, y, z);
            if (z < 0)
                return this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].getBlockInside(x, y, z + 16);
            if (z > 15)
                return this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].getBlockInside(x, y, z - 16);
        }
        catch (error) {
            //     console.log("Cannot get block of next subchunk!!",x,y,z);
        }
        return undefined;
    }
    isBlock(x, y, z) {
        if (x > -1 && x < 16 && y > -1 && y < 16 && z > -1 && z < 16) {
            return this.blocks[x][y][z].id > 0;
        }
        try {
            if (y < 0)
                return this.chunk.subchunks[this.pos.y - 1].isBlock(x, y + 16, z);
            if (y > 15)
                return this.chunk.subchunks[this.pos.y + 1].isBlock(x, y - 16, z);
            if (x < 0)
                return this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].isBlock(x + 16, y, z);
            if (x > 15)
                return this.chunk.neighbours["POS_X"].subchunks[this.pos.y].isBlock(x - 16, y, z);
            if (z < 0)
                return this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].isBlock(x, y, z + 16);
            if (z > 15)
                return this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].isBlock(x, y, z - 16);
        }
        catch (error) {
            console.log("Cannot get block of next subchunk!!", x, y, z);
            return false;
        }
    }
    lightFBlock(x, y, z) {
        if (x > -1 && x < 16 && y > -1 && y < 16 && z > -1 && z < 16) {
            return Block.info[this.blocks[x][y][z].id].type == blockType.FULL ? 0 : this.blocks[x][y][z].lightFBlock;
        }
        try {
            if (y < 0)
                return this.chunk.subchunks[this.pos.y - 1].lightFBlock(x, y + 16, z);
            if (y > 15)
                return this.chunk.subchunks[this.pos.y + 1].lightFBlock(x, y - 16, z);
            if (x < 0)
                return this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].lightFBlock(x + 16, y, z);
            if (x > 15)
                return this.chunk.neighbours["POS_X"].subchunks[this.pos.y].lightFBlock(x - 16, y, z);
            if (z < 0)
                return this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].lightFBlock(x, y, z + 16);
            if (z > 15)
                return this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].lightFBlock(x, y, z - 16);
        }
        catch (error) {
            console.log("Cannot get block of next subchunk!!", x, y, z);
        }
        return undefined;
    }
    lightSBlock(x, y, z) {
        if (x > -1 && x < 16 && y > -1 && y < 16 && z > -1 && z < 16) {
            return Block.info[this.blocks[x][y][z].id].type == blockType.FULL ? 0 : this.blocks[x][y][z].skyLight;
        }
        try {
            if (y < 0)
                return this.chunk.subchunks[this.pos.y - 1].lightSBlock(x, y + 16, z);
            if (y > 15)
                return this.chunk.subchunks[this.pos.y + 1].lightSBlock(x, y - 16, z);
            if (x < 0)
                return this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].lightSBlock(x + 16, y, z);
            if (x > 15)
                return this.chunk.neighbours["POS_X"].subchunks[this.pos.y].lightSBlock(x - 16, y, z);
            if (z < 0)
                return this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].lightSBlock(x, y, z + 16);
            if (z > 15)
                return this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].lightSBlock(x, y, z - 16);
        }
        catch (error) {
            console.log("Cannot get block of next subchunk!!", x, y, z);
        }
        return undefined;
    }
    getBlockID(x, y, z) {
        if (x > -1 && x < 16 && y > -1 && y < 16 && z > -1 && z < 16) {
            return this.blocks[x][y][z].id;
        }
        try {
            if (y < 0)
                return this.chunk.subchunks[this.pos.y - 1].getBlockID(x, y + 16, z);
            if (y > 15)
                return this.chunk.subchunks[this.pos.y + 1].getBlockID(x, y - 16, z);
            if (x < 0)
                return this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].getBlockID(x + 16, y, z);
            if (x > 15)
                return this.chunk.neighbours["POS_X"].subchunks[this.pos.y].getBlockID(x - 16, y, z);
            if (z < 0)
                return this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].getBlockID(x, y, z + 16);
            if (z > 15)
                return this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].getBlockID(x, y, z - 16);
        }
        catch (error) {
            //     console.log("Cannot get block of next subchunk!!",x,y,z);
        }
        return undefined;
    }
    getBlockSub(pos) {
        if (pos.x > -1 && pos.x < 16 && pos.y > -1 && pos.y < 16 && pos.z > -1 && pos.z < 16) {
            return { block: this.blocks[pos.x][pos.y][pos.z], sub: this, pos };
        }
        else {
            const transPos = new Vector(0, 0, 0);
            const func = (par) => {
                if (pos[par] < 0) {
                    pos[par] = 15;
                    transPos[par] = -1;
                    return true;
                }
                else if (pos[par] > 15) {
                    pos[par] = 0;
                    transPos[par] = 1;
                    return true;
                }
                return false;
            };
            if (func("x") || func("z")) //if block out of chunk
             {
                try {
                    if (transPos.x < 0)
                        return { block: this.chunk.neighbours["NEG_X"].subchunks[this.pos.y].getBlock(pos), sub: this.chunk.neighbours["NEG_X"].subchunks[this.pos.y], pos };
                    if (transPos.x > 0)
                        return { block: this.chunk.neighbours["POS_X"].subchunks[this.pos.y].getBlock(pos), sub: this.chunk.neighbours["POS_X"].subchunks[this.pos.y], pos };
                    if (transPos.z < 0)
                        return { block: this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y].getBlock(pos), sub: this.chunk.neighbours["NEG_Z"].subchunks[this.pos.y], pos };
                    if (transPos.z > 0)
                        return { block: this.chunk.neighbours["POS_Z"].subchunks[this.pos.y].getBlock(pos), sub: this.chunk.neighbours["POS_Z"].subchunks[this.pos.y], pos };
                }
                catch (error) {
                    // console.log("Cannot get block of next subchunk!!",transPos);
                }
            }
            else if (func("y")) {
                try {
                    return { block: this.chunk.subchunks[this.pos.y + transPos.y].getBlock(pos), sub: this.chunk.subchunks[this.pos.y + transPos.y], pos };
                }
                catch (error) {
                    // console.log("Cannot get block of next subchunk!!",transPos.y+this.pos.y);
                    return undefined;
                }
            }
            //  console.log("Cannot get block");
            return undefined;
        }
    }
    vertexLAO(side1, side2, corner, bl) {
        return (side1 + side2 + corner + (bl * 3)) / 6;
    }
    //DONE: update vertices only tree sides
    updateSide(x, y, z, dx, dy, dz, vStart, side, block, index, vBuffer) {
        const testedBlock = this.getBlockWV(dx + x, dy + y, dz + z);
        if (testedBlock == undefined)
            return;
        if (Block.info[block.id].type != blockType.FULL) {
            if (Block.info[testedBlock.id].type != blockType.EMPTY) {
                if (Block.info[testedBlock.id].type == blockType.FULL)
                    this.tmpMesh.vertices.push(...vBuffer[side]);
                else if (Block.info[testedBlock.id].type == blockType.NOTFULL)
                    this.tmpMesh.vertices.push(...(SubChunk.transform(x + dx, y + (this.pos.y * 16) + dy, z + dz, Block.info[testedBlock.id].customMesh[SubChunk.flip(side)])));
                // this.tmpMesh.vertices.push(...(vBuffer[side]));
                this.tmpMesh.tCoords.push(...SubChunk.getTextureCords(testedBlock.id, SubChunk.flip(side)));
                this.tmpMesh.indices.push(index + 2, index + 1, index, index + 2, index, index + 3);
                if (dy == 1) {
                    const fo1 = this.vertexLAO(this.lightFBlock(x - 1, y, z), this.lightFBlock(x, y, z - 1), this.lightFBlock(x - 1, y, z - 1), block.lightFBlock);
                    const fo2 = this.vertexLAO(this.lightFBlock(x - 1, y, z), this.lightFBlock(x, y, z + 1), this.lightFBlock(x - 1, y, z + 1), block.lightFBlock);
                    const fo3 = this.vertexLAO(this.lightFBlock(x + 1, y, z), this.lightFBlock(x, y, z + 1), this.lightFBlock(x + 1, y, z + 1), block.lightFBlock);
                    const fo4 = this.vertexLAO(this.lightFBlock(x + 1, y, z), this.lightFBlock(x, y, z - 1), this.lightFBlock(x + 1, y, z - 1), block.lightFBlock);
                    const so1 = this.vertexLAO(this.lightSBlock(x - 1, y, z), this.lightSBlock(x, y, z - 1), this.lightSBlock(x - 1, y, z - 1), block.skyLight);
                    const so2 = this.vertexLAO(this.lightSBlock(x - 1, y, z), this.lightSBlock(x, y, z + 1), this.lightSBlock(x - 1, y, z + 1), block.skyLight);
                    const so3 = this.vertexLAO(this.lightSBlock(x + 1, y, z), this.lightSBlock(x, y, z + 1), this.lightSBlock(x + 1, y, z + 1), block.skyLight);
                    const so4 = this.vertexLAO(this.lightSBlock(x + 1, y, z), this.lightSBlock(x, y, z - 1), this.lightSBlock(x + 1, y, z - 1), block.skyLight);
                    this.tmpMesh.lightLevels.push(so1, so4, so3, so2);
                    this.tmpMesh.fb.push(fo1, fo4, fo3, fo2);
                }
                else if (dx == 1) {
                    const fo1 = this.vertexLAO(this.lightFBlock(x, y - 1, z), this.lightFBlock(x, y, z - 1), this.lightFBlock(x, y - 1, z - 1), block.lightFBlock);
                    const fo2 = this.vertexLAO(this.lightFBlock(x, y - 1, z), this.lightFBlock(x, y, z + 1), this.lightFBlock(x, y - 1, z + 1), block.lightFBlock);
                    const fo3 = this.vertexLAO(this.lightFBlock(x, y + 1, z), this.lightFBlock(x, y, z + 1), this.lightFBlock(x, y + 1, z + 1), block.lightFBlock);
                    const fo4 = this.vertexLAO(this.lightFBlock(x, y + 1, z), this.lightFBlock(x, y, z - 1), this.lightFBlock(x, y + 1, z - 1), block.lightFBlock);
                    const so1 = this.vertexLAO(this.lightSBlock(x, y - 1, z), this.lightSBlock(x, y, z - 1), this.lightSBlock(x, y - 1, z - 1), block.skyLight);
                    const so2 = this.vertexLAO(this.lightSBlock(x, y - 1, z), this.lightSBlock(x, y, z + 1), this.lightSBlock(x, y - 1, z + 1), block.skyLight);
                    const so3 = this.vertexLAO(this.lightSBlock(x, y + 1, z), this.lightSBlock(x, y, z + 1), this.lightSBlock(x, y + 1, z + 1), block.skyLight);
                    const so4 = this.vertexLAO(this.lightSBlock(x, y + 1, z), this.lightSBlock(x, y, z - 1), this.lightSBlock(x, y + 1, z - 1), block.skyLight);
                    this.tmpMesh.lightLevels.push(so1, so2, so3, so4);
                    this.tmpMesh.fb.push(fo1, fo2, fo3, fo4);
                }
                else if (dz == 1) {
                    const fo1 = this.vertexLAO(this.lightFBlock(x - 1, y, z), this.lightFBlock(x, y - 1, z), this.lightFBlock(x - 1, y - 1, z), block.lightFBlock);
                    const fo2 = this.vertexLAO(this.lightFBlock(x + 1, y, z), this.lightFBlock(x, y - 1, z), this.lightFBlock(x + 1, y - 1, z), block.lightFBlock);
                    const fo3 = this.vertexLAO(this.lightFBlock(x + 1, y, z), this.lightFBlock(x, y + 1, z), this.lightFBlock(x + 1, y + 1, z), block.lightFBlock);
                    const fo4 = this.vertexLAO(this.lightFBlock(x - 1, y, z), this.lightFBlock(x, y + 1, z), this.lightFBlock(x - 1, y + 1, z), block.lightFBlock);
                    const so1 = this.vertexLAO(this.lightSBlock(x - 1, y, z), this.lightSBlock(x, y - 1, z), this.lightSBlock(x - 1, y - 1, z), block.skyLight);
                    const so2 = this.vertexLAO(this.lightSBlock(x + 1, y, z), this.lightSBlock(x, y - 1, z), this.lightSBlock(x + 1, y - 1, z), block.skyLight);
                    const so3 = this.vertexLAO(this.lightSBlock(x + 1, y, z), this.lightSBlock(x, y + 1, z), this.lightSBlock(x + 1, y + 1, z), block.skyLight);
                    const so4 = this.vertexLAO(this.lightSBlock(x - 1, y, z), this.lightSBlock(x, y + 1, z), this.lightSBlock(x - 1, y + 1, z), block.skyLight);
                    this.tmpMesh.lightLevels.push(so1, so4, so3, so2);
                    this.tmpMesh.fb.push(fo1, fo4, fo3, fo2);
                }
                index += 4;
            }
        }
        if (Block.info[block.id].type != blockType.EMPTY) {
            if (Block.info[testedBlock.id].type != blockType.FULL) {
                if (Block.info[block.id].type == blockType.FULL)
                    this.tmpMesh.vertices.push(...vBuffer[SubChunk.flip(side)]);
                else if (Block.info[block.id].type == blockType.NOTFULL)
                    this.tmpMesh.vertices.push(...(SubChunk.transform(x, y + (this.pos.y * 16), z, Block.info[block.id].customMesh[side])));
                this.tmpMesh.tCoords.push(...SubChunk.getTextureCords(block.id, side));
                this.tmpMesh.indices.push(index + 2, index + 1, index, index + 2, index, index + 3);
                if (dy == 1) {
                    const fo1 = this.vertexLAO(this.lightFBlock(x - 1, y + 1, z), this.lightFBlock(x, y + 1, z - 1), this.lightFBlock(x - 1, y + 1, z - 1), testedBlock.lightFBlock);
                    const fo2 = this.vertexLAO(this.lightFBlock(x - 1, y + 1, z), this.lightFBlock(x, y + 1, z + 1), this.lightFBlock(x - 1, y + 1, z + 1), testedBlock.lightFBlock);
                    const fo3 = this.vertexLAO(this.lightFBlock(x + 1, y + 1, z), this.lightFBlock(x, y + 1, z + 1), this.lightFBlock(x + 1, y + 1, z + 1), testedBlock.lightFBlock);
                    const fo4 = this.vertexLAO(this.lightFBlock(x + 1, y + 1, z), this.lightFBlock(x, y + 1, z - 1), this.lightFBlock(x + 1, y + 1, z - 1), testedBlock.lightFBlock);
                    const so1 = this.vertexLAO(this.lightSBlock(x - 1, y + 1, z), this.lightSBlock(x, y + 1, z - 1), this.lightSBlock(x - 1, y + 1, z - 1), testedBlock.skyLight);
                    const so2 = this.vertexLAO(this.lightSBlock(x - 1, y + 1, z), this.lightSBlock(x, y + 1, z + 1), this.lightSBlock(x - 1, y + 1, z + 1), testedBlock.skyLight);
                    const so3 = this.vertexLAO(this.lightSBlock(x + 1, y + 1, z), this.lightSBlock(x, y + 1, z + 1), this.lightSBlock(x + 1, y + 1, z + 1), testedBlock.skyLight);
                    const so4 = this.vertexLAO(this.lightSBlock(x + 1, y + 1, z), this.lightSBlock(x, y + 1, z - 1), this.lightSBlock(x + 1, y + 1, z - 1), testedBlock.skyLight);
                    this.tmpMesh.lightLevels.push(so1, so2, so3, so4);
                    this.tmpMesh.fb.push(fo1, fo2, fo3, fo4);
                }
                else if (dx == 1) {
                    const fo1 = this.vertexLAO(this.lightFBlock(x + 1, y - 1, z), this.lightFBlock(x + 1, y, z - 1), this.lightFBlock(x + 1, y - 1, z - 1), testedBlock.lightFBlock);
                    const fo2 = this.vertexLAO(this.lightFBlock(x + 1, y - 1, z), this.lightFBlock(x + 1, y, z + 1), this.lightFBlock(x + 1, y - 1, z + 1), testedBlock.lightFBlock);
                    const fo3 = this.vertexLAO(this.lightFBlock(x + 1, y + 1, z), this.lightFBlock(x + 1, y, z + 1), this.lightFBlock(x + 1, y + 1, z + 1), testedBlock.lightFBlock);
                    const fo4 = this.vertexLAO(this.lightFBlock(x + 1, y + 1, z), this.lightFBlock(x + 1, y, z - 1), this.lightFBlock(x + 1, y + 1, z - 1), testedBlock.lightFBlock);
                    const so1 = this.vertexLAO(this.lightSBlock(x + 1, y - 1, z), this.lightSBlock(x + 1, y, z - 1), this.lightSBlock(x + 1, y - 1, z - 1), testedBlock.skyLight);
                    const so2 = this.vertexLAO(this.lightSBlock(x + 1, y - 1, z), this.lightSBlock(x + 1, y, z + 1), this.lightSBlock(x + 1, y - 1, z + 1), testedBlock.skyLight);
                    const so3 = this.vertexLAO(this.lightSBlock(x + 1, y + 1, z), this.lightSBlock(x + 1, y, z + 1), this.lightSBlock(x + 1, y + 1, z + 1), testedBlock.skyLight);
                    const so4 = this.vertexLAO(this.lightSBlock(x + 1, y + 1, z), this.lightSBlock(x + 1, y, z - 1), this.lightSBlock(x + 1, y + 1, z - 1), testedBlock.skyLight);
                    this.tmpMesh.lightLevels.push(so1, so4, so3, so2);
                    this.tmpMesh.fb.push(fo1, fo4, fo3, fo2);
                }
                else if (dz == 1) {
                    const fo1 = this.vertexLAO(this.lightFBlock(x, y - 1, z + 1), this.lightFBlock(x - 1, y, z + 1), this.lightFBlock(x - 1, y - 1, z + 1), testedBlock.lightFBlock);
                    const fo2 = this.vertexLAO(this.lightFBlock(x, y - 1, z + 1), this.lightFBlock(x + 1, y, z + 1), this.lightFBlock(x + 1, y - 1, z + 1), testedBlock.lightFBlock);
                    const fo3 = this.vertexLAO(this.lightFBlock(x, y + 1, z + 1), this.lightFBlock(x + 1, y, z + 1), this.lightFBlock(x + 1, y + 1, z + 1), testedBlock.lightFBlock);
                    const fo4 = this.vertexLAO(this.lightFBlock(x, y + 1, z + 1), this.lightFBlock(x - 1, y, z + 1), this.lightFBlock(x - 1, y + 1, z + 1), testedBlock.lightFBlock);
                    const so1 = this.vertexLAO(this.lightSBlock(x, y - 1, z + 1), this.lightSBlock(x - 1, y, z + 1), this.lightSBlock(x - 1, y - 1, z + 1), testedBlock.skyLight);
                    const so2 = this.vertexLAO(this.lightSBlock(x, y - 1, z + 1), this.lightSBlock(x + 1, y, z + 1), this.lightSBlock(x + 1, y - 1, z + 1), testedBlock.skyLight);
                    const so3 = this.vertexLAO(this.lightSBlock(x, y + 1, z + 1), this.lightSBlock(x + 1, y, z + 1), this.lightSBlock(x + 1, y + 1, z + 1), testedBlock.skyLight);
                    const so4 = this.vertexLAO(this.lightSBlock(x, y + 1, z + 1), this.lightSBlock(x - 1, y, z + 1), this.lightSBlock(x - 1, y + 1, z + 1), testedBlock.skyLight);
                    this.tmpMesh.lightLevels.push(so1, so2, so3, so4);
                    this.tmpMesh.fb.push(fo1, fo2, fo3, fo4);
                }
                index += 4;
            }
        }
        return index;
    }
    async updateVerticesOptimized() {
        let index = 0;
        let block;
        const temp = [];
        for (let x = 0; x < 16; x++)
            for (let y = 0; y < 16; y++)
                for (let z = 0; z < 16; z++) {
                    block = this.blocks[x][y][z];
                    for (let j = 0; j < SubChunk.cubeVert.length; j++) {
                        const tempArr = [];
                        for (let i = 0; i < SubChunk.cubeVert[j].length; i += 3) {
                            tempArr.push(SubChunk.cubeVert[j][i] + x);
                            tempArr.push(SubChunk.cubeVert[j][i + 1] + y + (this.pos.y * 16));
                            tempArr.push(SubChunk.cubeVert[j][i + 2] + z);
                        }
                        temp.push(tempArr);
                    }
                    index = this.updateSide(x, y, z, 1, 0, 0, 36, Side.left, block, index, temp);
                    index = this.updateSide(x, y, z, 0, 1, 0, 60, Side.top, block, index, temp);
                    index = this.updateSide(x, y, z, 0, 0, 1, 12, Side.front, block, index, temp);
                    temp.length = 0;
                    await occasionalSleeper();
                }
        return index;
    }
    static flip(side) {
        switch (side) {
            case Side.back:
                return Side.front;
            case Side.front:
                return Side.back;
            case Side.top:
                return Side.bottom;
            case Side.bottom:
                return Side.top;
            case Side.left:
                return Side.right;
            case Side.right:
                return Side.left;
        }
    }
    //Generates full subchunk of air
    genEmpty() {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    this.blocks[x][y][z] = new Block(0);
                }
            }
        }
        this.generated = true;
    }
    static blockTextureCoords = Object.freeze({
        1: [
            0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
        ],
        2: [
            1.01, 1.0,
            1.99, 1.0,
            1.99, 0.0,
            1.01, 0.0,
        ],
        3: [
            2.01, 1.0,
            2.99, 1.0,
            2.99, 0.0,
            2.01, 0.0,
        ]
    });
    static getTextureCords(id, face) {
        const index = Block.info[id].textureIndex[face];
        const uvs = Texture.testAtkas.coords[index];
        if (face == Side.front || face == Side.right || face == Side.bottom)
            return [
                uvs.x, uvs.dy,
                uvs.dx, uvs.dy,
                uvs.dx, uvs.y,
                uvs.x, uvs.y,
            ];
        else
            return [uvs.x, uvs.dy,
                uvs.x, uvs.y,
                uvs.dx, uvs.y,
                uvs.dx, uvs.dy,];
    }
    static getRandColor() {
        return [0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
        ];
    }
    static transform(x, y, z, arr) {
        const tempArr = [];
        for (let i = 0; i < arr.length; i += 3) {
            tempArr.push(arr[i] + x);
            tempArr.push(arr[i + 1] + y);
            tempArr.push(arr[i + 2] + z);
        }
        return tempArr;
    }
    static defArrow = [
        //Facing POS_Z
        0.2, 0, -0.2,
        0, 0, 0.3,
        -0.2, 0, -0.2,
        //Facing NEG_Z
        0.2, 0, 0.2,
        0, 0, -0.3,
        -0.2, 0, 0.2,
        //Facing POS_X
        -0.2, 0, 0.2,
        0.3, 0, 0,
        -0.2, 0, -0.2,
        //Facing NEG_X
        0.2, 0, 0.2,
        -0.3, 0, 0,
        0.2, 0, -0.2,
        //Facing POS_Y
        0, -0.2, 0.2,
        0, 0.3, 0,
        0, -0.2, -0.2,
        //Facing NEG_Y
        0, 0.2, 0.2,
        0, -0.3, 0,
        0, 0.2, -0.2
    ];
    /*export enum Side
{
   top,bottom,front,back,left, right
}*/
    static defVertices = [
        //przód
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        //tył
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        //lewo
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        //prawo
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        //dół
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        //góra
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5
    ];
    static cubeVert = [
        [
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
        ],
        [
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5
        ],
        [
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
        ],
        [
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
        ],
        [
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
        ],
        [
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
        ]
    ];
}
const occasionalSleeper = (function () {
    //
    let lastSleepingTime = performance.now();
    return function () {
        if (performance.now() - lastSleepingTime > 100) {
            lastSleepingTime = performance.now();
            return new Promise(resolve => setTimeout(resolve, 0));
        }
        else {
            return Promise.resolve();
        }
    };
}());
