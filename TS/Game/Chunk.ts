import { CanvaManager } from "../Engine/CanvaManager.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
import { SubChunk } from "./SubChunk.js"
let gl = CanvaManager.gl;
export class Chunk
{
    subchunks:Array<SubChunk> = new Array(16);
    constructor(x,z)
    {
        console.log("Constructing chunk");
        for(let i =0; i<this.subchunks.length;i++)
        {
            this.subchunks[i] = new SubChunk(new Vector(x,i,z));
            console.log("Completed generating subchunk: "+i);
        }
        console.log("done constructing");
    }
    render()
    {
        for(let i =0; i<this.subchunks.length;i++)
        {
            this.subchunks[i].vao.bind();
           Main.shader.loadUniforms(Main.camera.getProjection(),this.subchunks[i].transformation,Main.camera.getView());
             gl.drawElements(gl.TRIANGLES,this.subchunks[i].indices.length,gl.UNSIGNED_INT,0);
        }
    }

}