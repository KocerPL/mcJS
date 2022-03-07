import { CanvaManager } from "../Engine/CanvaManager.js";
import { EBO } from "../Engine/EBO.js";
import { Texture } from "../Engine/Texture.js";
import { VAO } from "../Engine/VAO.js";
import { VBO } from "../Engine/VBO.js";
import { Main } from "../Main.js";
import { blocks } from "./Block.js";
let gl = CanvaManager.gl;
export class GUI {
    static vao; //Vertex attrib array
    static vbo; //vertices
    static ebo; //Indices(vertex connections)
    static tco; //Texture coordinates
    static ind;
    static cVert;
    static bvao; //Vertex attrib array
    static bvbo; //vertices
    static bebo; //Indices(vertex connections)
    static btco; //Texture coordinates
    static bInd;
    static vArray;
    static iArray;
    static tArray;
    static indArray;
    static squareIndices = [
        0, 1, 2, 1, 0, 3
    ];
    static crosscords = [
        -0.02, -0.02,
        0.02, 0.02,
        -0.02, 0.02,
        0.02, -0.02
    ];
    static crosstcords = [
        0, 1,
        1, 0,
        0, 0,
        1, 1,
    ];
    static slotTCoords = [
        0, 0,
        1, 1,
        0, 1,
        1, 0
    ];
    static selTCoords = [
        0, 0,
        1, 1,
        0, 1,
        1, 0
    ];
    static init() {
        this.vao = new VAO;
        this.vbo = new VBO;
        this.vao.addPtr(0, 2, 0, 0);
        this.tco = new VBO;
        this.vao.addPtr(1, 2, 0, 0);
        this.ind = new VBO;
        this.vao.addPtr(2, 1, 0, 0);
        this.ebo = new EBO;
        this.bvao = new VAO;
        this.bvbo = new VBO;
        this.bvao.addPtr(0, 2, 0, 0);
        this.btco = new VBO;
        this.bvao.addPtr(1, 2, 0, 0);
        this.bebo = new EBO;
        this.bInd = new VBO;
        this.vao.addPtr(2, 1, 0, 0);
        this.updateBuffers();
    }
    static update() {
        this.updateBuffers();
    }
    static updateBuffers() {
        this.vArray = new Array();
        this.tArray = new Array();
        this.iArray = new Array();
        this.indArray = new Array();
        //pushing vertices, indices, textureCoordinates
        this.vArray = this.vArray.concat(this.crosscords);
        this.tArray = this.tArray.concat(this.crosstcords);
        this.iArray = this.iArray.concat(this.squareIndices);
        this.indArray = this.indArray.concat([0, 0, 0, 0]);
        let slCoords = [
            -0.38, -1,
            -0.30, -0.92,
            -0.38, -0.92,
            -0.30, -1
        ];
        let indices = this.squareIndices.slice(0, this.squareIndices.length);
        for (let i = 0; i < 9; i++) {
            for (let a = 0; a < indices.length; a++) {
                indices[a] = indices[a] + 4;
            }
            //  console.log(indices);
            this.vArray = this.vArray.concat(slCoords);
            if (Main.player.selectedItem == i)
                this.indArray = this.indArray.concat([2, 2, 2, 2]);
            else
                this.indArray = this.indArray.concat([1, 1, 1, 1]);
            this.tArray = this.tArray.concat(this.slotTCoords);
            this.iArray = this.iArray.concat(indices);
            for (let a = 0; a < slCoords.length; a += 2) {
                slCoords[a] = slCoords[a] + 0.08;
            }
        }
        //  console.log(this.iArray)
        this.vao.bind();
        this.vbo.bufferData(this.vArray);
        this.tco.bufferData(this.tArray);
        this.ebo.bufferData(this.iArray);
        this.ind.bufferData(this.indArray);
        VAO.unbind();
        this.cVert = this.iArray.length;
        //Blocks in gui
        this.vArray = new Array();
        this.tArray = new Array();
        this.iArray = new Array();
        this.indArray = new Array();
        slCoords = [
            -0.36, -0.98,
            -0.32, -0.94,
            -0.36, -0.94,
            -0.32, -0.98
        ];
        indices = this.squareIndices.slice(0, this.squareIndices.length);
        for (let i = 0; i < 9; i++) {
            //   console.log(indices);
            this.vArray = this.vArray.concat(slCoords);
            this.tArray = this.tArray.concat(this.crosstcords);
            this.iArray = this.iArray.concat(indices);
            this.indArray = this.indArray.concat([blocks[Main.player.itemsBar[i]].textureIndex.front, blocks[Main.player.itemsBar[i]].textureIndex.front, blocks[Main.player.itemsBar[i]].textureIndex.front, blocks[Main.player.itemsBar[i]].textureIndex.front]);
            for (let a = 0; a < indices.length; a++) {
                indices[a] = indices[a] + 4;
            }
            for (let a = 0; a < slCoords.length; a += 2) {
                slCoords[a] = slCoords[a] + 0.08;
            }
        }
        this.bvao.bind();
        this.bvbo.bufferData(this.vArray);
        this.btco.bufferData(this.tArray);
        this.bebo.bufferData(this.iArray);
        this.bInd.bufferData(this.indArray);
        VAO.unbind();
    }
    static render(shader) {
        shader.use();
        shader.loadUniforms(CanvaManager.getProportion, 64);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, Texture.blocksGridTest);
        this.bvao.bind();
        gl.drawElements(gl.TRIANGLES, this.iArray.length, gl.UNSIGNED_INT, 0);
        shader.loadUniforms(CanvaManager.getProportion, 256);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, Texture.GUItest);
        this.vao.bind();
        gl.drawElements(gl.TRIANGLES, this.cVert, gl.UNSIGNED_INT, 0);
    }
    static getTextureCords(blockID, face) {
        let index = blocks[blockID].textureIndex[face];
        let rowNum = Math.floor(index / Texture.SIZE);
        let column = index % Texture.SIZE;
        let temp = [
            column + 1.0, rowNum + 0.9,
            column, rowNum,
            column + 1.0, rowNum,
            column, rowNum + 0.9,
        ];
        return temp;
    }
}
