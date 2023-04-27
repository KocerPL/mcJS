import { CanvaManager } from "./CanvaManager.js";
let gl = CanvaManager.gl;
export class EBO {
    ID;
    constructor() {
        this.ID = gl.createBuffer();
        this.bind();
    }
    bufferData(data) {
        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), gl.STATIC_DRAW);
    }
    bind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ID);
    }
    get getID() {
        return this.ID;
    }
    static unbind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
