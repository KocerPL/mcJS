import { CanvaManager } from "../CanvaManager.js";
import { Loader } from "../Loader.js";
const gl = CanvaManager.gl;
export class Shader {
    locationCache = new Map();
    ID;
    constructor(vertFile, fragFile) {
        const vertCode = Loader.txtFile(vertFile);
        const fragCode = Loader.txtFile(fragFile);
        const vert = gl.createShader(gl.VERTEX_SHADER);
        const frag = gl.createShader(gl.FRAGMENT_SHADER);
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
    loadMatrix(name, matrix) {
        gl.uniformMatrix4fv(this.getLocation(name), false, matrix.toFloat32Array());
    }
    loadFloat(name, float) {
        gl.uniform1f(this.getLocation(name), float);
    }
    loadVec3(name, vec) {
        gl.uniform3f(this.getLocation(name), vec.x, vec.y, vec.z);
    }
    loadVec4(name, vec) {
        gl.uniform4f(this.getLocation(name), vec.x, vec.y, vec.z, vec.w);
    }
    getLocation(name) {
        if (this.locationCache.has(name))
            return this.locationCache.get(name);
        else {
            const loc = gl.getUniformLocation(this.ID, name);
            this.locationCache.set(name, loc);
            return loc;
        }
    }
}
