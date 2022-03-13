import { CanvaManager } from "./CanvaManager.js";
let gl = CanvaManager.gl;
export class VAO {
    ID;
    constructor() {
        this.ID = gl.createVertexArray();
        this.bind();
    }
    addPtr(location, length, stride, offset, type) {
        gl.vertexAttribPointer(location, length, type ?? gl.FLOAT, false, stride, offset);
        gl.enableVertexAttribArray(location);
    }
    bind() {
        gl.bindVertexArray(this.ID);
    }
    static unbind() {
        gl.bindVertexArray(null);
    }
}
