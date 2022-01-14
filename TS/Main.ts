import { CanvaManager } from "./Engine/CanvaManager.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
let gl = CanvaManager.gl;
 class Main
{
   public static run():void
   {
      CanvaManager.setupCanva(document.body);
     let vertices = [
        0,0.5,0,
        0.5,0,0,
        0,0,0.5
     ];
     let vao = new VAO();
     let vbo = new VBO();
     vbo.bufferData(vertices);
     vao.addPtr(0,3,0,0);
     gl.clearColor(0,0.5,0,1);
     gl.clear(gl.COLOR_BUFFER_BIT);
   }
}
Main.run();