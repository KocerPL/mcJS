import { CanvaManager } from "../Engine/CanvaManager.js";
import { EBO } from "../Engine/EBO.js";
import { Texture } from "../Engine/Texture.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { VAO } from "../Engine/VAO.js";
import { VBO } from "../Engine/VBO.js";
import { Main } from "../Main.js";
import { blocks } from "./Block.js";
import { World } from "./World.js";
let gl = CanvaManager.gl;
export class SubChunk {
    ebo;
    vbo;
    vtc;
    vao;
    nor;
    normals;
    blocks = new Array(16);
    tasks = new Array();
    generated = false;
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
    transformation = Matrix.identity();
    constructor(pos) {
        this.transformation = this.transformation.translate(pos.x * 16, pos.y * 16, pos.z * 16);
        let yPos = pos.y * 16;
        let xPos = pos.x * 16;
        let zPos = pos.z * 16;
        for (let x = 0; x < 16; x++) {
            this.blocks[x] = new Array();
            for (let y = 0; y < 16; y++) {
                this.blocks[x][y] = new Array();
                for (let z = 0; z < 16; z++) {
                    let ah = World.getHeight(x + xPos, z + zPos);
                    if (ah - 3 >= (y + yPos)) {
                        if (Math.round(Math.random() * 10) == 1) {
                            this.blocks[x][y][z] = 4;
                        }
                        else {
                            this.blocks[x][y][z] = 3;
                        }
                    }
                    else if (ah - 1 >= (y + yPos))
                        this.blocks[x][y][z] = 1;
                    else if (ah >= (y + yPos))
                        this.blocks[x][y][z] = 2;
                    else
                        this.blocks[x][y][z] = 0;
                }
            }
        }
        this.vao = new VAO();
        this.vbo = new VBO();
        this.vao.addPtr(0, 3, 0, 0);
        this.vtc = new VBO();
        this.vao.addPtr(1, 2, 0, 0);
        this.nor = new VBO();
        this.vao.addPtr(2, 3, 0, 0);
        this.ebo = new EBO();
        VAO.unbind();
        VBO.unbind();
        EBO.unbind();
        //  console.log(this.blocks);
        this.updateVerticesIndices(1);
    }
    updateVerticesOneLevel(x, y, index) {
        let indices = new Array();
        let vertices = new Array();
        let textureCoords = new Array();
        let normals = new Array();
        //  let index = 0;
        for (let z = 0; z < 16; z++) {
            if (this.blocks[x][y][z] == 0)
                continue;
            let temp = new Array();
            for (let i = 0; i < SubChunk.defVertices.length; i += 3) {
                temp.push(SubChunk.defVertices[i] + x);
                temp.push(SubChunk.defVertices[i + 1] + y);
                temp.push(SubChunk.defVertices[i + 2] + z);
            }
            if (x - 1 < 0 || this.blocks[x - 1][y][z] < 1) {
                vertices = vertices.concat(temp.slice(24, 36));
                normals = normals.concat(SubChunk.defNormals.slice(24, 36));
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "left"));
                index += 4;
            }
            if (x + 1 > 15 || this.blocks[x + 1][y][z] < 1) {
                vertices = vertices.concat(temp.slice(36, 48));
                normals = normals.concat(SubChunk.defNormals.slice(36, 48));
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "right"));
                index += 4;
            }
            if (y + 1 > 15 || this.blocks[x][y + 1][z] < 1) {
                vertices = vertices.concat(temp.slice(60, 72));
                normals = normals.concat(SubChunk.defNormals.slice(60, 72));
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "top"));
                index += 4;
            }
            if (y - 1 < 0 || this.blocks[x][y - 1][z] < 1) {
                vertices = vertices.concat(temp.slice(48, 60));
                normals = normals.concat(SubChunk.defNormals.slice(48, 60));
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "bottom"));
                index += 4;
            }
            if (z + 1 > 15 || this.blocks[x][y][z + 1] < 1) {
                vertices = vertices.concat(temp.slice(12, 24));
                normals = normals.concat(SubChunk.defNormals.slice(12, 24));
                indices = indices.concat(index + 2, index + 1, index, index + 2, index, index + 3);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "front"));
                index += 4;
            }
            if (z - 1 < 0 || this.blocks[x][y][z - 1] < 1) {
                vertices = vertices.concat(temp.slice(0, 12));
                normals = normals.concat(SubChunk.defNormals.slice(0, 12));
                indices = indices.concat(index + 1, index + 2, index, index + 3, index, index + 2);
                textureCoords = textureCoords.concat(SubChunk.getTextureCords(this.blocks[x][y][z], "back"));
                //  console.log("z");
                index += 4;
            }
        }
        return { v: vertices, i: indices, c: textureCoords, ind: index, n: normals };
    }
    updateVerticesIndices(priority) {
        this.vertices = new Array();
        this.indices = new Array();
        this.colors = new Array();
        this.normals = new Array();
        let index = 0;
        // let done = new Array();
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                Main.tasks[priority].push(() => {
                    let vic = this.updateVerticesOneLevel(x, y, index);
                    //    console.log(x,y,vic);
                    this.vertices = this.vertices.concat(vic.v);
                    this.normals = this.vertices.concat(vic.n);
                    this.indices = this.indices.concat(vic.i);
                    this.colors = this.colors.concat(vic.c);
                    index = vic.ind;
                    //console.log("c:",this.colors);
                    /*   for(let z=0;z<16;z++)
                       {
                           if(this.blocks[x][y][z]==0) continue;
                           let temp = new Array();
                           for(let i=0;i<SubChunk.defVertices.length;i+=3)
                           {
                               temp.push(SubChunk.defVertices[i]+x);
                               temp.push(SubChunk.defVertices[i+1]+y);
                               temp.push(SubChunk.defVertices[i+2]+z);
                           }
                         
                          if(x-1 <0 || this.blocks[x-1][y][z]<1)
                           {
                           this.vertices = this.vertices.concat(temp.slice(24,36));
                           this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                           this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                           index+=4;
                           }
                           if(x+1 > 15 ||this.blocks[x+1][y][z]<1)
                           {
                           this.vertices = this.vertices.concat(temp.slice(36,48));
                           this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                           this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                           index+=4;
                           }
                           if(y+1 > 15 ||this.blocks[x][y+1][z]<1)
                           {
                           this.vertices = this.vertices.concat(temp.slice(60,72));
                           this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                           this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                           index+=4;
                           }
                           if(y-1 < 0 ||this.blocks[x][y-1][z]<1)
                           {
                           this.vertices = this.vertices.concat(temp.slice(48,60));
                           this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                           this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                           index+=4;
                           }
                           if(z+1>15||this.blocks[x][y][z+1]<1)
                           {
                           this.vertices = this.vertices.concat(temp.slice(12,24));
                           this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                           this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                           index+=4;
                           }
                           if(z-1 <0||this.blocks[x][y][z-1]<1)
                           {
                           this.vertices = this.vertices.concat(temp.slice(0,12));
                           this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                           this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                         //  console.log("z");
                           index+=4;
                           }
                       } */
                });
            }
        }
        Main.tasks[priority].push(() => {
            this.bufferVIC();
            this.count = this.indices.length;
            this.generated = true;
        });
        //  console.log(this.vertices);
        // console.log(this.indices);
        //console.log(this.colors);
    }
    bufferVIC() {
        this.vao.bind();
        this.vbo.bufferData(this.vertices);
        this.nor.bufferData(this.normals);
        this.vtc.bufferData(this.colors);
        this.ebo.bufferData(this.indices);
        VAO.unbind();
    }
    render() {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    this.blocks[x][y][z] = 1;
                }
            }
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
    static getTextureCords(type, face) {
        let index = blocks[type].textureIndex[face];
        let posInGrid = index * Texture.rowSize;
        let rowNum = Math.floor(index / Texture.SIZE);
        let column = index % Texture.SIZE;
        let temp = [
            column, rowNum + 1.0,
            column + 1.0, rowNum + 1.0,
            column + 1.0, rowNum + 0.0,
            column + 0.0, rowNum + 0.0,
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
