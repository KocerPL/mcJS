import { Array3D } from "../Engine/Utils/Array3D.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Block, blocks, directions } from "./Block.js";
import { World } from "./World.js";
import { Mesh } from "./Mesh.js";
export class SubChunk {
    mesh = new Mesh(); //Mesh that contains all data needed for rendering  
    blocks = new Array3D(16, 16, 16); //Array of blocks
    generated = false; //Is SubChunk already generated
    inReGeneration = false; //Is subchunk in regeneration state
    lightUpdate = false; //Is subchunk updating light
    // empty:boolean = true;    //Is subchunk empty
    chunk; //parent Chunk of this subchunk
    pos; //subchunk position in world
    constructor(pos, chunk) {
        //Setting up variables
        this.pos = pos;
        this.chunk = chunk;
    }
    preGenerate() {
        //setting position according to subchunk pos in world
        let yPos = this.pos.y * 16;
        //Iterating for each block
        for (let x = 0; x < 16; x++)
            for (let y = 0; y < 16; y++)
                for (let z = 0; z < 16; z++) {
                    let ah = this.chunk.heightmap[x][z];
                    if (ah - 3 >= (y + yPos)) // if position lower than 3 blocks on heightmap
                     {
                        if (Math.round(Math.random() * 10) == 1) //Randomizing greenstone ores
                            this.blocks[x][y][z] = new Block(4);
                        else
                            this.blocks[x][y][z] = new Block(3); //Setting stone
                    }
                    else if (ah - 1 >= (y + yPos))
                        this.blocks[x][y][z] = new Block(1); //Setting Grass block
                    else if (ah >= (y + yPos)) {
                        this.blocks[x][y][z] = new Block(2);
                    }
                    else if (World.waterLevel > y + yPos)
                        this.blocks[x][y][z] = new Block(-1);
                    else if (!(this.blocks[x][y][z] instanceof Block)) {
                        this.blocks[x][y][z] = new Block(0);
                        if (ah + 1 <= (y + yPos)) {
                            this.blocks[x][y][z].skyLight = 15;
                            this.blocks[x][y][z].skyLightDir = directions.SOURCE;
                        }
                    }
                }
        this.generated = true;
    }
    //Subchunk update
    update() {
        this.mesh.reset();
        this.inReGeneration = true;
        this.updateVerticesOptimized();
        this.mesh.count = this.mesh.indices.length;
        this.lightUpdate = false;
        this.inReGeneration = false;
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
    getBlockSub(pos) {
        if (pos.x > -1 && pos.x < 16 && pos.y > -1 && pos.y < 16 && pos.z > -1 && pos.z < 16) {
            return { block: this.blocks[pos.x][pos.y][pos.z], sub: this, pos };
        }
        else {
            let transPos = new Vector(0, 0, 0);
            let func = (par) => {
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
    //DONE: update vertices only tree sides
    updateVerticesOptimized() {
        let index = 0;
        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 16; y++) {
                    let block = this.blocks[x][y][z];
                    let temp = new Array();
                    for (let i = 0; i < SubChunk.defVertices.length; i += 3) {
                        temp.push(SubChunk.defVertices[i] + x);
                        temp.push(SubChunk.defVertices[i + 1] + y + (this.pos.y * 16));
                        temp.push(SubChunk.defVertices[i + 2] + z);
                    }
                    let side = (vec, vStart, side) => {
                        let testedBlock = this.getBlock(new Vector(vec.x + x, vec.y + y, vec.z + z));
                        if (testedBlock == undefined)
                            return;
                        if (block.id < 1) {
                            if (testedBlock.id > 0) {
                                this.mesh.vertices.push(...temp.slice(vStart, vStart + 12));
                                this.mesh.tCoords.push(...SubChunk.getTextureCords(testedBlock, SubChunk.flip(side)));
                                this.mesh.indices.push(index + 2, index + 1, index, index + 2, index, index + 3);
                                this.mesh.lightLevels.push(block.skyLight, block.skyLight, block.skyLight, block.skyLight);
                                this.mesh.fb.push(block.lightFBlock, block.lightFBlock, block.lightFBlock, block.lightFBlock);
                                index += 4;
                            }
                        }
                        else {
                            if (testedBlock.id < 1) {
                                this.mesh.vertices.push(...temp.slice(vStart, vStart + 12));
                                this.mesh.tCoords.push(...SubChunk.getTextureCords(block, side));
                                this.mesh.indices.push(index + 2, index + 1, index, index + 2, index, index + 3);
                                this.mesh.lightLevels.push(testedBlock.skyLight, testedBlock.skyLight, testedBlock.skyLight, testedBlock.skyLight);
                                this.mesh.fb.push(testedBlock.lightFBlock, testedBlock.lightFBlock, testedBlock.lightFBlock, testedBlock.lightFBlock);
                                index += 4;
                            }
                        }
                    };
                    side(new Vector(1, 0, 0), 36, "left");
                    side(new Vector(0, -1, 0), 48, "bottom");
                    side(new Vector(0, 0, -1), 0, "back");
                }
        return index;
    }
    static flip(side) {
        if (side == "back")
            return "front";
        else if (side == "bottom")
            return "top";
        else if (side == "left")
            return "right";
        else if (side == "front")
            return "back";
        else if (side == "top")
            return "bottom";
        else if (side == "right")
            return "left";
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
        ;
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
    static getTextureCords(block, face) {
        let index = blocks[block.id].textureIndex[face];
        let temp = [
            0.0, 1.0, index,
            1.0, 1.0, index,
            1.0, 0.0, index,
            0.0, 0.0, index
        ];
        return temp;
    }
    static getTextureCords2(blockID, face) {
        let index = blocks[blockID].textureIndex[face];
        let temp = [
            0.0, 1.0, index,
            1.0, 1.0, index,
            1.0, 0.0, index,
            0.0, 0.0, index
        ];
        return temp;
    }
    static getRandColor(x, y, z) {
        return [0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
        ];
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
    static defVertices = [
        //przód
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        //tył
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        //lewo
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        //prawo
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        //dół
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        //góra
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5
    ];
}
