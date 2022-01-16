import { CanvaManager } from "./CanvaManager.js";
export class VBO {
    ID;
    constructor() {
        let gl = CanvaManager.gl;
        this.ID = gl.createBuffer();
        this.bind();
    }
    bufferData(data) {
        let gl = CanvaManager.gl;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }
    bind() {
        let gl = CanvaManager.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ID);
    }
    get getID() {
        return this.ID;
    }
    static unbind() {
        let gl = CanvaManager.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
