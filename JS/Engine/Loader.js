import { EBO } from "./EBO.js";
import { RawModel } from "./RawModel.js";
import { VAO } from "./VAO.js";
import { VBO } from "./VBO.js";

export class Loader
{
   static loadToVao(gl,positions,colors,indices)
   {
     let vao = new VAO(gl);
     let vboP = new VBO(gl);
     vboP.bufferData(gl,positions);
     vao.addAttribPointer(gl,0,3,3,0);
     
     let vboC = new VBO(gl);
     vboC.bufferData(gl,colors);
     vao.addAttribPointer(gl,1,3,3,0);
     let ebo = new EBO(gl);
    ebo.bufferData(gl,indices);
     vao.unbind(gl);
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
     return new RawModel(vao,indices.length)
   }

}