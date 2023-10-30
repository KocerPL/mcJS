import { CanvaManager } from "./CanvaManager.js";
const gl = CanvaManager.gl;
export class VBO {
    ID;
    constructor() {
        this.ID = gl.createBuffer();
        this.bind();
    }
    bufferData(data) {
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }
    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ID);
    }
    get getID() {
        return this.ID;
    }
    static unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    static delete(vbo) {
        gl.deleteBuffer(vbo.ID);
    }
}
