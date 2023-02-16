import { EBO } from "./EBO.js";
import { VAO } from "./VAO.js";
import { VBO } from "./VBO.js";

export class RenderSet
{
    vao:VAO;
    vbo:VBO;
    vtc:VBO;
    vlo:VBO;
    ebo:EBO;
    vfb:VBO;
    index:number = 0;
    vertices:Array<number> = new Array();
    textureCoords:Array<number> = new Array();
    skyLight:Array<number> = new Array();
    blockLight:Array<number> = new Array();
    indices:Array<number> = new Array();
    count:number=0;
    constructor()
    {
        this.vao = new VAO();
        this.vbo = new VBO();
      
        this.vao.addPtr(0,3,0,0);
        this.vtc = new VBO();
       
        this.vao.addPtr(1,3,0,0);
        this.vlo = new VBO();
     
        this.vao.addPtr(2,1,0,0);
        this.vfb = new VBO();
        this.vao.addPtr(3,1,0,0);
        this.ebo = new EBO();
      
        VAO.unbind();
        VBO.unbind();
        EBO.unbind();
    }
    bufferArrays()
    {
        this.vao.bind();
        this.vbo.bufferData(this.vertices);
        this.vtc.bufferData(this.textureCoords);
        this.vlo.bufferData(this.skyLight);
        this.vfb.bufferData(this.blockLight);
        this.ebo.bufferData(this.indices);
        VAO.unbind();
        this.count=this.indices.length;
    }
    add(vertices:Array<number>,textureCoords:Array<number>,skyLight:Array<number>,blockLight:Array<number>,indices:Array<number>,index:number)
    {
        this.vertices = this.vertices.concat(vertices);
        this.textureCoords = this.textureCoords.concat(textureCoords);
        this.skyLight = this.skyLight.concat(skyLight);
        this.blockLight =this.blockLight.concat(blockLight);
        this.indices= this.indices.concat(indices);
        this.index+=index; 
    }
    resetArrays()
    {
        this.vertices = new Array();
        this.textureCoords = new Array();
       this.skyLight = new Array();
       this.blockLight = new Array();
        this.indices = new Array();
        this.index=0;
    }
}