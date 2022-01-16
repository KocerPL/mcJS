import { CanvaManager } from "../CanvaManager.js";
import { Loader } from "../Loader.js";
let gl = CanvaManager.gl;
export class Shader {
    ID;
    constructor(vertFile, fragFile) {
        let vertCode = Loader.txtFile(vertFile);
        let fragCode = Loader.txtFile(fragFile);
        let vert = gl.createShader(gl.VERTEX_SHADER);
        let frag = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vert, vertCode);
        gl.shaderSource(frag, fragCode);
        gl.compileShader(vert);
        gl.compileShader(frag);
        if (gl.getShaderInfoLog(vert).length > 0)
            console.log(gl.getShaderInfoLog(vert));
        if (gl.getShaderInfoLog(frag).length > 0)
            console.log(gl.getShaderInfoLog(frag));
        this.ID = gl.createProgram();
        gl.attachShader(this.ID, vert);
        gl.attachShader(this.ID, frag);
        gl.linkProgram(this.ID);
        gl.useProgram(this.ID);
    }
    use() {
        gl.useProgram(this.ID);
    }
}
