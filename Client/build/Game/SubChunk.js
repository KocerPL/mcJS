import { Array3D } from "../Engine/Utils/Array3D.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Block, blocks } from "./Block.js";
import { World } from "./World.js";
import { Mesh } from "./Mesh.js";
class SubChunk {
    mesh = new Mesh(); //Mesh that contains all data needed for rendering  
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
    emptyLightMap() {
        for (let i = 0; i < 16; i++)
            for (let j = 0; j < 16; j++)
                for (let k = 0; k < 16; k++) {
                    //      this.lightMap[i][j][k]=false;
                    if (!this.blocks[i][j][k])
                        this.blocks[i][j][k] = new Block(0);
                    this.blocks[i][j][k].lightFBlock = 0;
                    if (blocks[this.blocks[i][j][k].id].glowing)
                        this.blocks[i][j][k].lightFBlock = blocks[this.blocks[i][j][k].id].glowing;
                    if (this.blocks[i][j][k].id > 0)
                        //        this.lightMap[i][j][k] =true;
                        k;
                }
    }
    lightPass(currentPass) {
        for (let i = 0; i < 16; i++)
            for (let j = 0; j < 16; j++)
                for (let k = 0; k < 16; k++) {
                    //  if(this.lightMap[i][j][k]) continue;
                    let test = this.getBlockWV(i - 1, j, k);
                    if (test && test.lightFBlock + 2 > this.blocks[i][j][k].lightFBlock) {
                        this.blocks[i][j][k].lightFBlock = test.lightFBlock - 1;
                    }
                    test = this.getBlockWV(i + 1, j, k);
                    if (test && test.lightFBlock + 2 > this.blocks[i][j][k].lightFBlock) {
                        this.blocks[i][j][k].lightFBlock = test.lightFBlock - 1;
                    }
                    test = this.getBlockWV(i, j - 1, k);
                    if (test && test.lightFBlock + 2 > this.blocks[i][j][k].lightFBlock) {
                        this.blocks[i][j][k].lightFBlock = test.lightFBlock - 1;
                    }
                    test = this.getBlockWV(i, j + 1, k);
                    if (test && test.lightFBlock + 2 > this.blocks[i][j][k].lightFBlock) {
                        this.blocks[i][j][k].lightFBlock = test.lightFBlock - 1;
                    }
                    test = this.getBlockWV(i, j, k - 1);
                    if (test && test.lightFBlock + 2 > this.blocks[i][j][k].lightFBlock) {
                        this.blocks[i][j][k].lightFBlock = test.lightFBlock - 1;
                    }
                    test = this.getBlockWV(i, j, k + 1);
                    if (test && test.lightFBlock + 2 > this.blocks[i][j][k].lightFBlock) {
                        this.blocks[i][j][k].lightFBlock = test.lightFBlock - 1;
                    }
                    if (this.blocks[i][j][k].lightFBlock == currentPass)
                        k; // this.lightMap[i][j][k]=true;
                }
    }
    preGenerate() {
        //setting position according to subchunk pos in world
        const yPos = this.pos.y * 16;
        //Iterating for each block
        for (let x = 0; x < 16; x++)
            for (let y = 0; y < 16; y++)
                for (let z = 0; z < 16; z++) {
                    const ah = this.chunk.heightmap[x][z];
                    if (ah == (y + yPos) && ah > 170) {
                        if (ah > 180 || Math.round(Math.random() * 10) > 180 - ah)
                            this.blocks[x][y][z] = new Block(11);
                        else {
                            this.blocks[x][y][z] = new Block(0);
                            this.blocks[x][y][z].skyLight = 15;
                        }
                    }
                    else if (ah - 3 >= (y + yPos) || (ah >= (y + yPos) && ah > 150)) // if position lower than 3 blocks on heightmap
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
                        }
                    }
                }
        this.generated = true;
    }
    //Subchunk update
    scanLight() {
        this.lightList = [];
        for (let i = 0; i < 16; i++)
            for (let j = 0; j < 16; j++)
                for (let k = 0; k < 16; k++) {
                    if (this.blocks[i][j][k] && blocks[this.blocks[i][j][k].id].glowing)
                        this.lightList.push(new Vector(i, j, k));
                }
    }
    update() {
        // this.chunk.updateLight();
        this.scanLight();
        this.chunk.preUpdate(this.pos.y);
        this.mesh.reset();
        this.updateVerticesOptimized();
        this.mesh.count = this.mesh.indices.length;
        this.lightUpdate = false;
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
    //DONE: update vertices only tree sides
    updateSide(x, y, z, dx, dy, dz, vStart, side, block, index, vBuffer) {
        const testedBlock = this.getBlockWV(dx + x, dy + y, dz + z);
        if (testedBlock == undefined)
            return;
        if (block.id < 1) {
            if (testedBlock.id > 0) {
                this.mesh.vertices.push(...vBuffer.slice(vStart, vStart + 12));
                this.mesh.tCoords.push(...SubChunk.getTextureCords(testedBlock, SubChunk.flip(side)));
                this.mesh.indices.push(index + 2, index + 1, index, index + 2, index, index + 3);
                this.mesh.lightLevels.push(block.skyLight, block.skyLight, block.skyLight, block.skyLight);
                this.mesh.fb.push(block.lightFBlock, block.lightFBlock, block.lightFBlock, block.lightFBlock);
                index += 4;
            }
        }
        else {
            if (testedBlock.id < 1) {
                this.mesh.vertices.push(...vBuffer.slice(vStart, vStart + 12));
                this.mesh.tCoords.push(...SubChunk.getTextureCords(block, side));
                this.mesh.indices.push(index + 2, index + 1, index, index + 2, index, index + 3);
                this.mesh.lightLevels.push(testedBlock.skyLight, testedBlock.skyLight, testedBlock.skyLight, testedBlock.skyLight);
                this.mesh.fb.push(testedBlock.lightFBlock, testedBlock.lightFBlock, testedBlock.lightFBlock, testedBlock.lightFBlock);
                index += 4;
            }
        }
        return index;
    }
    updateVerticesOptimized() {
        let index = 0;
        for (let x = 0; x < 16; x++)
            for (let y = 0; y < 16; y++)
                for (let z = 0; z < 16; z++) {
                    const block = this.blocks[x][y][z];
                    const temp = [];
                    //20 ms for 65535
                    for (let i = 0; i < SubChunk.defVertices.length; i += 3) {
                        temp.push(SubChunk.defVertices[i] + x);
                        temp.push(SubChunk.defVertices[i + 1] + y + (this.pos.y * 16));
                        temp.push(SubChunk.defVertices[i + 2] + z);
                    }
                    index = this.updateSide(x, y, z, 1, 0, 0, 36, "left", block, index, temp);
                    index = this.updateSide(x, y, z, 0, -1, 0, 48, "bottom", block, index, temp);
                    index = this.updateSide(x, y, z, 0, 0, -1, 0, "back", block, index, temp);
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
        const index = blocks[block.id].textureIndex[face];
        const temp = [
            0.0, 1.0, index,
            1.0, 1.0, index,
            1.0, 0.0, index,
            0.0, 0.0, index
        ];
        return temp;
    }
    static getTextureCordsInd(index) {
        const temp = [
            0.0, 1.0, index,
            1.0, 1.0, index,
            1.0, 0.0, index,
            0.0, 0.0, index
        ];
        return temp;
    }
    static getTextureCords2(blockID, face) {
        const index = blocks[blockID].textureIndex[face];
        const temp = [
            0.0, 1.0, index,
            1.0, 1.0, index,
            1.0, 0.0, index,
            0.0, 0.0, index
        ];
        return temp;
    }
    static getRandColor() {
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
export { SubChunk };
