import { CanvaManager } from "../Engine/CanvaManager.js";
import { EBO } from "../Engine/EBO.js";
import { Texture } from "../Engine/Texture.js";
import { Array3D } from "../Engine/Utils/Array3D.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { VAO } from "../Engine/VAO.js";
import { VBO } from "../Engine/VBO.js";
import { Main } from "../Main.js";
import { Block, blocks, dirAssoc, directions } from "./Block.js";
import { World } from "./World.js";
let gl = CanvaManager.gl;
export class SubChunk {
    ebo;
    vbo;
    vtc;
    vao;
    vlo; // Light vbo
    vfb;
    // nor:VBO;
    fromBlock;
    blocks = new Array3D(16, 16, 16);
    generated = false;
    inReGeneration = false;
    lightUpdate = false;
    empty = false;
    count;
    static defBlocks = new Array(16);
    static rand = new Array(64);
    static dirtTexture = new Texture(0, 0);
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
    vertices = new Array();
    indices = new Array();
    colors = new Array();
    lightLevels = new Array();
    transformation = Matrix.identity();
    pos;
    constructor(pos, heightmap, isLazy) {
        this.pos = pos;
        this.transformation = this.transformation.translate(pos.x * 16, pos.y * 16, pos.z * 16);
        if (!isLazy) {
            this.generate(pos, heightmap);
        }
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
    }
    genBlocks() {
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
    generate(pos, heightmap) {
        let yPos = pos.y * 16;
        let xPos = pos.x * 16;
        let zPos = pos.z * 16;
        Main.tasks[2].push(() => {
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 16; y++) {
                    for (let z = 0; z < 16; z++) {
                        let ah = World.getHeight(x + xPos, z + zPos);
                        if (ah - 3 >= (y + yPos)) {
                            if (Math.round(Math.random() * 10) == 1) {
                                this.blocks[x][y][z] = new Block(4);
                            }
                            else {
                                this.blocks[x][y][z] = new Block(3);
                            }
                        }
                        else if (ah - 1 >= (y + yPos))
                            this.blocks[x][y][z] = new Block(1);
                        else if (ah >= (y + yPos)) {
                            if (Math.round(Math.random() * 100) == 1 && !(World.waterLevel > y + yPos))
                                World.generateTree(new Vector(xPos + x, y + yPos, zPos + z));
                            heightmap[x][z] = ah;
                            this.blocks[x][y][z] = new Block(2);
                        }
                        else if (World.waterLevel > y + yPos)
                            this.blocks[x][y][z] = new Block(-1);
                        else if (!(this.blocks[x][y][z] instanceof Block)) {
                            this.blocks[x][y][z] = new Block(0);
                            if (ah + 1 == (y + yPos)) {
                                this.blocks[x][y][z].lightLevel = 15;
                                this.blocks[x][y][z].lightDir = directions.SKYLIGHT;
                            }
                        }
                    }
                }
            }
            this.generated = true;
            //  console.log(this.blocks);
            Main.tasks[3].push(() => {
                this.update(3);
            });
        });
    }
    update(priority) {
        if (this.inReGeneration)
            return;
        this.clearLight();
        this.updateLightLevels();
        this.updateVerticesIndices(priority);
    }
    clearLight() {
        for (let x = 0; x < 16; x++)
            for (let y = 0; y < 16; y++)
                for (let z = 0; z < 16; z++) {
                    if (this.blocks[x][y][z].id > 0)
                        continue;
                    this.blocks[x][y][z].lightLevel = 0;
                    this.blocks[x][y][z].lightFBlock = 0;
                    if (y + (this.pos.y * 16) == Main.getChunkAt(this.pos.x, this.pos.z).heightmap[x][z] + 1) {
                        this.blocks[x][y][z].lightLevel = 15;
                        //console.count("light");
                    }
                }
        //  console.countReset("light");
    }
    updateLightLevels() {
        for (let x = 0; x < 16; x++)
            for (let y = 0; y < 16; y++)
                for (let z = 0; z < 16; z++)
                    this.updateLightOneBlock(x, y, z);
        for (let x = 15; x > -1; x--)
            for (let y = 15; y > -1; y--)
                for (let z = 15; z > -1; z--)
                    this.updateLightOneBlock(x, y, z);
    }
    updateLightOneBlock(x, y, z) {
        let lightDir = directions.UNDEF;
        let light = 0;
        let light2 = 0;
        let theBlock = this.blocks[x][y][z];
        if (theBlock.id > 0)
            return;
        let chunk = Main.getChunkAt(this.pos.x, this.pos.z);
        if (y + (this.pos.y * 16) >= chunk.heightmap[x][z] + 1) {
            light = 15;
            lightDir = directions.SKYLIGHT;
        }
        let waterCount = 0;
        if (y + (this.pos.y * 16) < chunk.heightmap[x][z] + 4) {
            let side = (dir) => {
                let vec = dirAssoc[dir];
                if ((x + vec.x >= 0 && y + vec.y >= 0 && z + vec.z >= 0 && x + vec.x < 16 && y + vec.y < 16 && z + vec.z < 16)) {
                    let block = this.blocks[x + vec.x][y + vec.y][z + vec.z];
                    if (block.id == 10) {
                        //       console.log("heh");
                        light2 = 15;
                    }
                    else if (block.id < 1) {
                        if (block.id == -1 && dir != directions.NEG_Y && dir != directions.POS_Y) {
                            waterCount++;
                        }
                        if (light + 1 < block.lightLevel) {
                            light = block.lightLevel - 1;
                            lightDir = dir;
                        }
                        if (light2 + 1 < block.lightFBlock) {
                            light2 = block.lightFBlock - 1;
                        }
                    }
                }
                else {
                    let subCpos = this.pos.copy();
                    let inscPos = new Vector(x, y, z);
                    if (vec.x < 0) {
                        subCpos.x -= 1;
                        inscPos.x = 15;
                    }
                    else if (vec.x > 0) {
                        subCpos.x += 1;
                        inscPos.x = 0;
                    }
                    else if (vec.y < 0) {
                        subCpos.y -= 1;
                        inscPos.y = 15;
                    }
                    else if (vec.y > 0) {
                        subCpos.y += 1;
                        inscPos.y = 0;
                    }
                    else if (vec.z < 0) {
                        subCpos.z -= 1;
                        inscPos.z = 15;
                    }
                    else if (vec.z > 0) {
                        subCpos.z += 1;
                        inscPos.z = 0;
                    }
                    try {
                        let block = Main.getChunkAt(subCpos.x, subCpos.z).subchunks[subCpos.y].blocks[inscPos.x][inscPos.y][inscPos.z];
                        if (block.id < 1) {
                            if (block.id == -1 && dir != directions.NEG_Y && dir != directions.POS_Y) {
                                waterCount++;
                            }
                            if (light + 1 < block.lightLevel) {
                                light = block.lightLevel - 1;
                                lightDir = dir;
                            }
                            if (light2 + 1 < block.lightFBlock) {
                                light2 = block.lightFBlock - 1;
                            }
                        }
                    }
                    catch (error) {
                    }
                }
            };
            side(directions.NEG_X);
            side(directions.POS_X);
            side(directions.NEG_Y);
            side(directions.POS_Y);
            side(directions.NEG_Z);
            side(directions.POS_Z);
        }
        if (waterCount > 1)
            theBlock.id = -1;
        theBlock.lightDir = lightDir;
        theBlock.lightLevel = light;
        theBlock.lightFBlock = light2;
    }
    //DONE: update vertices One level blocks shorted
    updateVerticesOneBlock(x, y, index) {
        let indices = new Array();
        let vertices = new Array();
        let textureCoords = new Array();
        let lightLevels = new Array();
        let fB = new Array();
        for (let z = 0; z < 16; z++) {
            if (this.blocks[x][y][z].id == 0) {
                if (!Main.dispLl)
                    continue;
                let temp2 = new Array();
                for (let i = 0; i < SubChunk.defArrow.length; i += 3) {
                    temp2.push(SubChunk.defArrow[i] + x);
                    temp2.push(SubChunk.defArrow[i + 1] + y);
                    temp2.push(SubChunk.defArrow[i + 2] + z);
                }
                let ll = this.blocks[x][y][z].lightLevel;
                if (this.blocks[x][y][z].lightDir == directions.NEG_Z) {
                    vertices = vertices.concat(temp2.slice(0, 9));
                    textureCoords = textureCoords.concat(SubChunk.getTextureCords2(8, "top").slice(0, 9));
                    indices = indices.concat(index + 2, index + 1, index);
                    lightLevels = lightLevels.concat(ll, ll, ll);
                    fB = fB.concat(true, true, true);
                    index += 3;
                }
                else if (this.blocks[x][y][z].lightDir == directions.POS_Z) {
                    vertices = vertices.concat(temp2.slice(9, 18));
                    textureCoords = textureCoords.concat(SubChunk.getTextureCords2(8, "top").slice(0, 9));
                    indices = indices.concat(index + 2, index + 1, index);
                    lightLevels = lightLevels.concat(ll, ll, ll);
                    fB = fB.concat(true, true, true);
                    index += 3;
                }
                else if (this.blocks[x][y][z].lightDir == directions.NEG_X) {
                    vertices = vertices.concat(temp2.slice(18, 27));
                    textureCoords = textureCoords.concat(SubChunk.getTextureCords2(8, "top").slice(0, 9));
                    indices = indices.concat(index + 2, index + 1, index);
                    lightLevels = lightLevels.concat(ll, ll, ll);
                    fB = fB.concat(true, true, true);
                    index += 3;
                }
                else if (this.blocks[x][y][z].lightDir == directions.POS_X) {
                    vertices = vertices.concat(temp2.slice(27, 36));
                    textureCoords = textureCoords.concat(SubChunk.getTextureCords2(8, "top").slice(0, 9));
                    indices = indices.concat(index + 2, index + 1, index);
                    lightLevels = lightLevels.concat(ll, ll, ll);
                    fB = fB.concat(true, true, true);
                    index += 3;
                }
                else if (this.blocks[x][y][z].lightDir == directions.NEG_Y) {
                    vertices = vertices.concat(temp2.slice(36, 45));
                    textureCoords = textureCoords.concat(SubChunk.getTextureCords2(8, "top").slice(0, 9));
                    indices = indices.concat(index + 2, index + 1, index);
                    lightLevels = lightLevels.concat(ll, ll, ll);
                    fB = fB.concat(true, true, true);
                    index += 3;
                }
                else if (this.blocks[x][y][z].lightDir == directions.POS_Y || y + (this.pos.y * 16) == Main.getChunkAt(this.pos.x, this.pos.z).heightmap[x][z] + 1) {
                    vertices = vertices.concat(temp2.slice(45, 54));
                    textureCoords = textureCoords.concat(SubChunk.getTextureCords2(8, "top").slice(0, 9));
                    indices = indices.concat(index + 2, index + 1, index);
                    lightLevels = lightLevels.concat(ll, ll, ll);
                    fB = fB.concat(true, true, true);
                    index += 3;
                }
                continue;
            }
            let todo = new Array();
            let temp = new Array();
            for (let i = 0; i < SubChunk.defVertices.length; i += 3) {
                temp.push(SubChunk.defVertices[i] + x);
                if (this.blocks[x][y][z].id == -1)
                    temp.push(SubChunk.defVertices[i + 1] + y - 0.2);
                else
                    temp.push(SubChunk.defVertices[i + 1] + y);
                temp.push(SubChunk.defVertices[i + 2] + z);
            }
            /*if(y+(this.pos.y*16)==Main.chunks[this.pos.x][this.pos.z].heightmap[x][z]+1)
            {
              vertices = vertices.concat(temp.slice(0,12));
              textureCoords = textureCoords.concat(SubChunk.getTextureCords2(10,"top"));
              indices = indices.concat(index+2,index+1,index,index+2,index,index+3);
              lightLevels = lightLevels.concat(15,15,15,15);
              index+=4;
            }*/
            let side = (vec, vStart, side) => {
                // console.log(this.blocks);
                if ((x + vec.x >= 0 && y + vec.y >= 0 && z + vec.z >= 0 && x + vec.x < 16 && y + vec.y < 16 && z + vec.z < 16)) {
                    if ((this.blocks[x + vec.x][y + vec.y][z + vec.z].id <= 0 && this.blocks[x][y][z].id > 0) || (this.blocks[x + vec.x][y + vec.y][z + vec.z].id == 0)) {
                        vertices = vertices.concat(temp.slice(vStart, vStart + 12));
                        textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], side));
                        indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                        lightLevels = lightLevels.concat(this.blocks[x + vec.x][y + vec.y][z + vec.z].lightLevel, this.blocks[x + vec.x][y + vec.y][z + vec.z].lightLevel, this.blocks[x + vec.x][y + vec.y][z + vec.z].lightLevel, this.blocks[x + vec.x][y + vec.y][z + vec.z].lightLevel);
                        fB = fB.concat(this.blocks[x + vec.x][y + vec.y][z + vec.z].lightFBlock, this.blocks[x + vec.x][y + vec.y][z + vec.z].lightFBlock, this.blocks[x + vec.x][y + vec.y][z + vec.z].lightFBlock, this.blocks[x + vec.x][y + vec.y][z + vec.z].lightFBlock);
                        index += 4;
                    }
                }
                else {
                    let light = -2;
                    let light2 = -2;
                    let subCpos = this.pos.copy();
                    let inscPos = new Vector(x, y, z);
                    if (vec.x < 0) {
                        subCpos.x -= 1;
                        inscPos.x = 15;
                    }
                    else if (vec.x > 0) {
                        subCpos.x += 1;
                        inscPos.x = 0;
                    }
                    else if (vec.y < 0) {
                        subCpos.y -= 1;
                        inscPos.y = 15;
                    }
                    else if (vec.y > 0) {
                        subCpos.y += 1;
                        inscPos.y = 0;
                    }
                    else if (vec.z < 0) {
                        subCpos.z -= 1;
                        inscPos.z = 15;
                    }
                    else if (vec.z > 0) {
                        subCpos.z += 1;
                        inscPos.z = 0;
                    }
                    let blocked = false;
                    try {
                        let block = Main.getChunkAt(subCpos.x, subCpos.z).subchunks[subCpos.y].blocks[inscPos.x][inscPos.y][inscPos.z];
                        if (block.id < 1) {
                            light2 = block.lightFBlock;
                            if ((this.blocks[x][y][z].id < 0 && block.id < 0))
                                blocked = true;
                            light = block.lightLevel;
                        }
                    }
                    catch (error) {
                    }
                    if (light2 == -2)
                        light2 = 0;
                    if (light == -2)
                        light = 15;
                    if (!blocked) {
                        vertices = vertices.concat(temp.slice(vStart, vStart + 12));
                        textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], side));
                        indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                        lightLevels = lightLevels.concat(light, light, light, light);
                        fB = fB.concat(light2, light2, light2, light2);
                        index += 4;
                    }
                }
                // else
                // console.count("hehe");
            };
            if (this.blocks[x][y][z].id == -1) {
                side(new Vector(0, 1, 0), 60, "top");
                continue;
            }
            side(new Vector(-1, 0, 0), 24, "right");
            side(new Vector(1, 0, 0), 36, "left");
            side(new Vector(0, -1, 0), 48, "bottom");
            side(new Vector(0, 1, 0), 60, "top");
            side(new Vector(0, 0, -1), 0, "back");
            side(new Vector(0, 0, 1), 12, "front");
            while (todo.length > 0) {
                todo.shift()();
            }
        }
        return { v: vertices, i: indices, c: textureCoords, ind: index, lL: lightLevels, fB: fB };
    }
    updateVerticesOneAir(x, y, index, heightmap, once) {
        let subUpdate = new Array();
        let indices = new Array();
        let vertices = new Array();
        let textureCoords = new Array();
        let lightLevels = new Array();
        //  let index = 0;
        //console.log(this.blocks[x][y],x,y);
        for (let z = 0; z < 16; z++) {
            if (this.blocks[x][y][z].id > 0)
                continue;
            let todo = new Array();
            let temp = new Array();
            for (let i = 0; i < SubChunk.defVertices.length; i += 3) {
                temp.push(SubChunk.defVertices[i] + x);
                temp.push(SubChunk.defVertices[i + 1] + y);
                temp.push(SubChunk.defVertices[i + 2] + z);
            }
            let light = 0;
            if (y + (this.pos.y * 16) == heightmap[x][z] + 1)
                light = 15;
            let side = (vec, vStart, side) => {
                // console.log(this.blocks);
                if ((x + vec.x >= 0 && y + vec.y >= 0 && z + vec.z >= 0 && x + vec.x < 16 && y + vec.y < 16 && z + vec.z < 16)) {
                    if (this.blocks[x + vec.x][y + vec.y][z + vec.z].id > 0) {
                        todo.push(() => {
                            vertices = vertices.concat(temp.slice(vStart, vStart + 12));
                            textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x + vec.x][y + vec.y][z + vec.z], side));
                            indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                            lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel);
                            index += 4;
                        });
                    }
                    else if (this.blocks[x + vec.x][y + vec.y][z + vec.z].lightLevel > light + 1) {
                        light = this.blocks[x + vec.x][y + vec.y][z + vec.z].lightLevel - 1;
                    }
                }
                else {
                    let subCpos = this.pos.copy();
                    let inscPos = new Vector(x, y, z);
                    if (vec.x < 0) {
                        subCpos.x -= 1;
                        inscPos.x = 15;
                    }
                    else if (vec.x > 0) {
                        subCpos.x += 1;
                        inscPos.x = 0;
                    }
                    else if (vec.y < 0) {
                        subCpos.y -= 1;
                        inscPos.y = 15;
                    }
                    else if (vec.y > 0) {
                        subCpos.y += 1;
                        inscPos.y = 0;
                    }
                    else if (vec.z < 0) {
                        subCpos.z -= 1;
                        inscPos.z = 15;
                    }
                    else if (vec.z > 0) {
                        subCpos.z += 1;
                        inscPos.z = 0;
                    }
                    try {
                        let chunk = Main.getChunkAt(subCpos.x, subCpos.z);
                        let block = chunk.subchunks[subCpos.y].blocks[inscPos.x][inscPos.y][inscPos.z];
                        let subc = chunk.subchunks[subCpos.y];
                        if (block instanceof Block)
                            if (block.id > 0) {
                                //      console.log(block);
                                todo.push(() => {
                                    vertices = vertices.concat(temp.slice(vStart, vStart + 12));
                                    textureCoords = textureCoords.concat(SubChunk.getTextureCords(block, side));
                                    indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                                    lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel);
                                    index += 4;
                                });
                            }
                            else if (block.lightLevel > light + 1) {
                                light = block.lightLevel - 1;
                            }
                        if (!once && !subUpdate.includes(subc))
                            subUpdate.push(subc);
                    }
                    catch (error) {
                    }
                }
                // else
                // console.count("hehe");
            };
            side(new Vector(-1, 0, 0), 24, "left");
            side(new Vector(1, 0, 0), 36, "right");
            side(new Vector(0, -1, 0), 48, "top");
            side(new Vector(0, 1, 0), 60, "bottom");
            side(new Vector(0, 0, -1), 0, "front");
            side(new Vector(0, 0, 1), 12, "back");
            this.blocks[x][y][z].lightLevel = light;
            while (todo.length > 0) {
                todo.shift()();
            }
        }
        while (subUpdate.length > 0) {
            let sub = subUpdate.shift();
            if (sub.generated && !sub.inReGeneration)
                sub.updateVerticesIndices(3);
        }
        return { v: vertices, i: indices, c: textureCoords, ind: index, lL: lightLevels };
    }
    updateVerticesOneLevel(x, y, index, heightmap) {
        let indices = new Array();
        let vertices = new Array();
        let textureCoords = new Array();
        let lightLevels = new Array();
        //  let index = 0;
        //console.log(this.blocks[x][y],x,y);
        for (let z = 0; z < 16; z++) {
            if (this.blocks[x][y][z].id == 0)
                continue;
            if (y >= heightmap[x][z]) {
                this.blocks[x][y][z].lightLevel = 15;
            }
            let temp = new Array();
            for (let i = 0; i < SubChunk.defVertices.length; i += 3) {
                temp.push(SubChunk.defVertices[i] + x);
                temp.push(SubChunk.defVertices[i + 1] + y);
                temp.push(SubChunk.defVertices[i + 2] + z);
            }
            if (x - 1 < 0 || this.blocks[x - 1][y][z].id < 1) {
                vertices = vertices.concat(temp.slice(24, 36));
                //normals = normals.concat(SubChunk.defNormals.slice(24,36));
                try {
                    lightLevels = lightLevels.concat(this.blocks[x - 1][y][z].lightLevel, this.blocks[x - 1][y][z].lightLevel, this.blocks[x - 1][y][z].lightLevel, this.blocks[x - 1][y][z].lightLevel);
                }
                catch (error) {
                }
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "left"));
                index += 4;
            }
            if (x + 1 > 15 || this.blocks[x + 1][y][z].id < 1) {
                vertices = vertices.concat(temp.slice(36, 48));
                //normals = normals.concat(SubChunk.defNormals.slice(36,48));
                try {
                    lightLevels = lightLevels.concat(this.blocks[x + 1][y][z].lightLevel, this.blocks[x + 1][y][z].lightLevel, this.blocks[x + 1][y][z].lightLevel, this.blocks[x + 1][y][z].lightLevel);
                }
                catch (error) {
                }
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "right"));
                index += 4;
            }
            if (y + 1 > 15 || this.blocks[x][y + 1][z].id < 1) {
                vertices = vertices.concat(temp.slice(60, 72));
                //normals = normals.concat(SubChunk.defNormals.slice(60,72));
                try {
                    lightLevels = lightLevels.concat(this.blocks[x][y + 1][z].lightLevel, this.blocks[x][y + 1][z].lightLevel, this.blocks[x][y + 1][z].lightLevel, this.blocks[x][y + 1][z].lightLevel);
                }
                catch (error) {
                }
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "top"));
                index += 4;
            }
            if (y - 1 < 0 || this.blocks[x][y - 1][z].id < 1) {
                vertices = vertices.concat(temp.slice(48, 60));
                //normals = normals.concat(SubChunk.defNormals.slice(48,60));
                try {
                    lightLevels = lightLevels.concat(this.blocks[x][y - 1][z].lightLevel, this.blocks[x][y - 1][z].lightLevel, this.blocks[x][y - 1][z].lightLevel, this.blocks[x][y - 1][z].lightLevel);
                }
                catch (error) {
                }
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "bottom"));
                index += 4;
            }
            if (z + 1 > 15 || this.blocks[x][y][z + 1].id < 1) {
                vertices = vertices.concat(temp.slice(12, 24));
                //normals = normals.concat(SubChunk.defNormals.slice(12,24));
                try {
                    lightLevels = lightLevels.concat(this.blocks[x][y][z + 1].lightLevel, this.blocks[x][y][z + 1].lightLevel, this.blocks[x][y][z + 1].lightLevel, this.blocks[x][y][z + 1].lightLevel);
                }
                catch (error) {
                }
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "front"));
                index += 4;
            }
            if (z - 1 < 0 || this.blocks[x][y][z - 1].id < 1) {
                vertices = vertices.concat(temp.slice(0, 12));
                //normals = normals.concat(SubChunk.defNormals.slice(0,12));
                try {
                    lightLevels = lightLevels.concat(this.blocks[x][y][z - 1].lightLevel, this.blocks[x][y][z - 1].lightLevel, this.blocks[x][y][z - 1].lightLevel, this.blocks[x][y][z - 1].lightLevel);
                }
                catch (error) {
                }
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "back"));
                //  console.log("z");
                index += 4;
            }
        }
        return { v: vertices, i: indices, c: textureCoords, ind: index, lL: lightLevels };
    }
    updateVerticesIndices(priority) {
        console.log("Updating");
        this.fromBlock = new Array();
        this.vertices = new Array();
        this.indices = new Array();
        this.colors = new Array();
        this.lightLevels = new Array();
        let index = 0;
        this.inReGeneration = true;
        // let done = new Array();
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                Main.tasks[priority].push(() => {
                    let vic = this.updateVerticesOneBlock(x, y, index);
                    //    console.log(x,y,vic);
                    this.vertices = this.vertices.concat(vic.v);
                    //  this.normals =   this.vertices.concat(vic.n);
                    //  console.log(vic.lL);
                    this.lightLevels = this.lightLevels.concat(vic.lL);
                    this.indices = this.indices.concat(vic.i);
                    this.colors = this.colors.concat(vic.c);
                    this.fromBlock = this.fromBlock.concat(vic.fB);
                    index = vic.ind;
                    //console.log("c:",this.colors);
                });
            }
        }
        // console.timeEnd("Updating");
        //   if(this.indices.length>0)
        Main.tasks[priority].push(() => {
            this.bufferVIC();
            this.count = this.indices.length;
            this.lightUpdate = false;
            this.inReGeneration = false;
        });
        //  console.log(this.vertices);
        // console.log(this.indices);
        //console.log(this.colors);
    }
    bufferVIC() {
        if (this.indices.length <= 1)
            this.empty = true;
        else {
            this.empty = false;
            this.vao.bind();
            this.vbo.bufferData(this.vertices);
            this.vlo.bufferData(this.lightLevels);
            this.vtc.bufferData(this.colors);
            this.ebo.bufferData(this.indices);
            this.vfb.bufferData(this.fromBlock);
            VAO.unbind();
        }
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
}
