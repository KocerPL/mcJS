import {Canvas} from "./Engine/Canvas.js";
import { Pencil } from "./Engine/Pencil.js";

export class Main 
{
    static canva = new Canvas(document.body);
    static pencil = new Pencil(this.canva);
    static run()
    {
        let vertices = 
        [
            0.0,1.0,0.0, 1.0,0.0,0.0,
            -0.5,0.0,0.0, 0.0,0.0,0.0,
            0.5,0.0,0.0, 0.0,0.0,1.0
        ];
        this.pencil.clear(0,1.0,0);
        let gl = this.canva.gl;
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        let vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW);
      console.log(Float32Array.BYTES_PER_ELEMENT);
       gl.vertexAttribPointer(0,3,gl.FLOAT,false,6*Float32Array.BYTES_PER_ELEMENT,0*Float32Array.BYTES_PER_ELEMENT);
       gl.enableVertexAttribArray(0);
      
       gl.vertexAttribPointer(1,3,gl.FLOAT,false,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
       gl.enableVertexAttribArray(1);
       gl.bindVertexArray(null);
       this.canva.shader.use(gl);
       gl.bindVertexArray(vao);
    
       gl.drawArrays(gl.TRIANGLES,0,3);
        console.log("okj");
    }
}
Main.run();