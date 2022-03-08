import { CanvaManager } from "../Engine/CanvaManager.js";
import { EBO } from "../Engine/EBO.js";
import { Texture } from "../Engine/Texture.js";
import { Array3D } from "../Engine/Utils/Array3D.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { VAO } from "../Engine/VAO.js";
import { VBO } from "../Engine/VBO.js";
import { Main } from "../Main.js";
import { Block, blocks } from "./Block.js";
import { World } from "./World.js";
let gl = CanvaManager.gl;
export class SubChunk {
    ebo;
    vbo;
    vtc;
    vao;
    vlo; // Light vbo
    // nor:VBO;
    normals;
    blocks = new Array3D(16, 16, 16);
    tasks = new Array();
    generated = false;
    inReGeneration = false;
    lightUpdate = false;
    empty = false;
    count;
    static defBlocks = new Array(16);
    static rand = new Array(64);
    static dirtTexture = new Texture(0, 0);
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
    static defNormals = [
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        //tył
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        //lewo
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        //prawo
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        //dół
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        //góra
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];
    vertices = new Array();
    indices = new Array();
    colors = new Array();
    lightLevels = new Array();
    transformation = Matrix.identity();
    constructor(pos, heightmap) {
        this.transformation = this.transformation.translate(pos.x * 16, pos.y * 16, pos.z * 16);
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
                            this.blocks[x][y][z].lightLevel = 15;
                        }
                        else if (World.waterLevel > y + yPos)
                            this.blocks[x][y][z] = new Block(7);
                        else
                            this.blocks[x][y][z] = new Block(0);
                    }
                }
            }
            this.vao = new VAO();
            this.vbo = new VBO();
            this.vao.addPtr(0, 3, 0, 0);
            this.vtc = new VBO();
            this.vao.addPtr(1, 3, 0, 0);
            this.vlo = new VBO();
            this.vao.addPtr(2, 1, 0, 0);
            this.ebo = new EBO();
            VAO.unbind();
            VBO.unbind();
            EBO.unbind();
            //  console.log(this.blocks);
            Main.tasks[3].push(() => {
                this.updateVerticesIndices(3, heightmap);
            });
        });
    }
    updateVerticesOneLevel(x, y, index, heightmap) {
        let indices = new Array();
        let vertices = new Array();
        let textureCoords = new Array();
        let lightLevels = new Array();
        //  let index = 0;
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
                lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1);
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "left"));
                index += 4;
            }
            if (x + 1 > 15 || this.blocks[x + 1][y][z].id < 1) {
                vertices = vertices.concat(temp.slice(36, 48));
                //normals = normals.concat(SubChunk.defNormals.slice(36,48));
                lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1);
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "right"));
                index += 4;
            }
            if (y + 1 > 15 || this.blocks[x][y + 1][z].id < 1) {
                vertices = vertices.concat(temp.slice(60, 72));
                //normals = normals.concat(SubChunk.defNormals.slice(60,72));
                lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel, this.blocks[x][y][z].lightLevel);
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "top"));
                index += 4;
            }
            if (y - 1 < 0 || this.blocks[x][y - 1][z].id < 1) {
                vertices = vertices.concat(temp.slice(48, 60));
                //normals = normals.concat(SubChunk.defNormals.slice(48,60));
                lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel - 2, this.blocks[x][y][z].lightLevel - 2, this.blocks[x][y][z].lightLevel - 2, this.blocks[x][y][z].lightLevel - 2);
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "bottom"));
                index += 4;
            }
            if (z + 1 > 15 || this.blocks[x][y][z + 1].id < 1) {
                vertices = vertices.concat(temp.slice(12, 24));
                //normals = normals.concat(SubChunk.defNormals.slice(12,24));
                lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1);
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "front"));
                index += 4;
            }
            if (z - 1 < 0 || this.blocks[x][y][z - 1].id < 1) {
                vertices = vertices.concat(temp.slice(0, 12));
                //normals = normals.concat(SubChunk.defNormals.slice(0,12));
                lightLevels = lightLevels.concat(this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1, this.blocks[x][y][z].lightLevel - 1);
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "back"));
                //  console.log("z");
                index += 4;
            }
        }
        return { v: vertices, i: indices, c: textureCoords, ind: index, lL: lightLevels };
    }
    updateVerticesIndices(priority, heightmap) {
        // console.time("Updating");
        if (this.inReGeneration) { //Main.tasks[priority].push( ()=>{this.updateVerticesIndices(priority,heightmap); console.log("self lock")});
            return;
        }
        ;
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
                    let vic = this.updateVerticesOneLevel(x, y, index, heightmap);
                    //    console.log(x,y,vic);
                    this.vertices = this.vertices.concat(vic.v);
                    //  this.normals =   this.vertices.concat(vic.n);
                    //  console.log(vic.lL);
                    this.lightLevels = this.lightLevels.concat(vic.lL);
                    this.indices = this.indices.concat(vic.i);
                    this.colors = this.colors.concat(vic.c);
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
            this.generated = true;
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
    static getRandColor(x, y, z) {
        return [0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
        ];
    }
}
