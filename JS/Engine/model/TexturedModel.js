import { Loader } from "../Loader.js";
import { Matrix } from "../Utils/Matrix.js";
import { VBO } from "../VBO.js";
export class TexturedModel
{
    constructor(gl,vertices,indices,textureCoords,texture)
    {
        this.raw = Loader.loadToVao(gl,vertices,indices); 
        this.transformation = new Matrix();
        this.raw.vao.bind(gl);
        this.raw.tbc = new VBO(gl);
        this.raw.tbc.bufferData(gl, textureCoords);
        this.raw.vao.addAttribPointer(gl,1,2,0,0);
        this.raw.tbc.unbind(gl);
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,this.texture);
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([0, 0, 255, 255]));
        texture.addEventListener('load',() =>
        {
            console.log("loaded");
            this.raw.vao.bind(gl);
            gl.bindTexture(gl.TEXTURE_2D,this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
            this.raw.vao.unbind(gl);
        });
        this.raw.vao.unbind(gl);
        
    }
}