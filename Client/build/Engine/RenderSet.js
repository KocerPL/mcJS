import { EBO } from "./EBO.js";
import { VAO } from "./VAO.js";
import { VBO } from "./VBO.js";
export class RenderSet {
    vao;
    vbo;
    vtc;
    vlo;
    ebo;
    vfb;
    index = 0;
    vertices = [];
    textureCoords = [];
    skyLight = [];
    blockLight = [];
    indices = [];
    count = 0;
    constructor() {
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
    bufferArrays() {
        this.vao.bind();
        this.vbo.bufferData(this.vertices);
        this.vtc.bufferData(this.textureCoords);
        this.vlo.bufferData(this.skyLight);
        this.vfb.bufferData(this.blockLight);
        this.ebo.bufferData(this.indices);
        VAO.unbind();
        this.count = this.indices.length;
    }
    add(vertices, textureCoords, skyLight, blockLight, indices, index) {
        this.vertices = this.vertices.concat(vertices);
        this.textureCoords = this.textureCoords.concat(textureCoords);
        this.skyLight = this.skyLight.concat(skyLight);
        this.blockLight = this.blockLight.concat(blockLight);
        this.indices = this.indices.concat(indices);
        this.index += index;
    }
    resetArrays() {
        this.vertices = [];
        this.textureCoords = [];
        this.skyLight = [];
        this.blockLight = [];
        this.indices = [];
        this.index = 0;
    }
}
