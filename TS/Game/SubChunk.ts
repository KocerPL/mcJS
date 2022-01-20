import { CanvaManager } from "../Engine/CanvaManager.js";
import { EBO } from "../Engine/EBO.js";
import { Texture } from "../Engine/Texture.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { VAO } from "../Engine/VAO.js";
import { VBO } from "../Engine/VBO.js";

let gl = CanvaManager.gl;
export class SubChunk
{
    ebo:EBO;
    vbo:VBO;
    vtc:VBO;
    vao:VAO;
    blocks:Array<Array<Array<number>>>= new Array(16);
    static defBlocks :Array<Array<Array<number>>>= new Array(16);

    static init()
    {
        for(let x=0;x<16;x++)
        {
            this.defBlocks[x] = new Array(16);
            for(let y=0;y<16;y++)
            {
                this.defBlocks[x][y] = new Array(16);
                for(let z=0;z<16;z++)
                {
                    this.defBlocks[x][y][z] = 1;
                }   
            }
        }
    }
    static rand:Array<number> = new Array(64);
    static dirtTexture = new Texture(0,0);
   static defVertices =[
        //przód
        -0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        0.5,0.5,-0.5,
        -0.5,0.5,-0.5,
        //tył
        -0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0.5,0.5,0.5,
        -0.5,0.5,0.5,
        //lewo
        -0.5,-0.5,-0.5,
        -0.5,-0.5,0.5,
        -0.5,0.5 ,0.5,
        -0.5,0.5,-0.5,
        //prawo
        0.5,-0.5,-0.5,
        0.5,-0.5,0.5,
        0.5,0.5 ,0.5,
        0.5,0.5,-0.5,
        //dół
        -0.5,-0.5,-0.5,
        -0.5,-0.5,0.5,
        0.5,-0.5 ,0.5,
        0.5,-0.5,-0.5,
        //góra
        -0.5,0.5,-0.5,
        -0.5,0.5,0.5,
        0.5,0.5 ,0.5,
        0.5,0.5,-0.5
  
    ];
    vertices = new Array();
    indices = new Array();
    colors = new Array();
    transformation = Matrix.identity();
    constructor(pos:Vector)
    {
     this.transformation =  this.transformation.translate(pos.x*16,pos.y*16,pos.z*16);
       this.blocks = SubChunk.defBlocks;
     
        this.blocks[15][15][10]=1;
        this.blocks[15][15][9]=1;
        this.vao = new VAO();
        this.vbo = new VBO();
        this.vao.addPtr(0,3,0,0);
        this.vtc = new VBO();
        this.vao.addPtr(1,2,0,0);
        this.ebo = new EBO();
        VAO.unbind();
        VBO.unbind();
        EBO.unbind();
      //  console.log(this.blocks);
      let start = new Date();
        this.updateVerticesIndices();
        let stop = new Date();
        console.log( stop.getTime() - start.getTime());
    }
 
    updateVerticesIndices() 
    {
        this.vertices= new Array();
        this.indices = new Array();
        this.colors = new Array();
        let index= 0;
        for(let x=0;x<16;x++)
        {
            for(let y=0;y<16;y++)
            {
               
                for(let z=0;z<16;z++)
                {
                    let temp = new Array();
                    for(let i=0;i<SubChunk.defVertices.length;i+=3)
                    {
                        temp.push(SubChunk.defVertices[i]+x);
                        temp.push(SubChunk.defVertices[i+1]+y);
                        temp.push(SubChunk.defVertices[i+2]+z);
                    }
                    if(this.blocks[x][y][z]!=0)
                    {
                   if(x-1 <0 || this.blocks[x-1][y][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(24,36));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                    index+=4;
                    }
                    if(x+1 > 15 ||this.blocks[x+1][y][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(36,48));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                    index+=4;
                    }
                    if(y+1 > 15 ||this.blocks[x][y+1][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(60,72));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                    index+=4;
                    }
                    if(y-1 < 0 ||this.blocks[x][y-1][z]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(48,60));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                    index+=4;
                    }
                    if(z>15||this.blocks[x][y][z+1]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(12,24));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                    index+=4;
                    }
                    if(z<0||this.blocks[x][y][z-1]!=1)
                    {
                    this.vertices = this.vertices.concat(temp.slice(0,12));
                    this.indices = this.indices.concat(index+2,index+1,index,index+3,index,index+2);
                    this.colors = this.colors.concat(SubChunk.getTextureCords(this.blocks[x][y][z]));
                    index+=4;
                    }
                }
                }   
            }
        }
        this.vao.bind();
        this.vbo.bufferData(this.vertices);
        this.vtc.bufferData(this.colors);
        this.ebo.bufferData(this.indices);
       // console.log(this.vertices);
     //   console.log(this.indices);
       // console.log(this.vertices);
    }
    render()
    {
        for(let x=0;x<16;x++)
        {
            for(let y=0;y<16;y++)
            {
                for(let z=0;z<16;z++)
                {
                    this.blocks[x][y][z] =1;
                }   
            }
        }
    }
    static blockTextureCoords = Object.freeze({
        1:[
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
        ],
        2:[
            1.0, 1.0,
            2.0, 1.0,
            2.0, 0.0,
            1.0, 0.0,
        ]
    });
    static getTextureCords(type) {
        return this.blockTextureCoords[type];
    }
  static  getRandColor(x,y,z)
    {
      return[ 0.0,0.0,
        0.0,1.0,
        1.0,1.0,
        1.0,0.0,
    ] ;
    }
}