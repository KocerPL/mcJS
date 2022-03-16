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
    vertices = new Array();
    textureCoords = new Array();
    lightLevels = new Array();
    indices = new Array();
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
    bufferArrays(vertices, textureCoords, light, indices) {
        this.vao.bind();
        this.vbo.bufferData(vertices);
        this.vtc.bufferData(textureCoords);
        this.vlo.bufferData(light);
        this.vfb.bufferData(light);
        this.ebo.bufferData(indices);
        VAO.unbind();
        this.count = indices.length;
    }
    add(vertices, textureCoords, lightLevels, indices, index) {
        this.vertices = this.vertices.concat(vertices);
        this.textureCoords = this.textureCoords.concat(textureCoords);
        this.lightLevels = this.lightLevels.concat(lightLevels);
        this.indices = this.indices.concat(indices);
        this.index += index;
    }
    resetArrays() {
        this.vertices = new Array();
        this.textureCoords = new Array();
        this.lightLevels = new Array();
        this.indices = new Array();
        this.index = 0;
    }
}
