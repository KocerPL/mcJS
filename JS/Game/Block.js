import { Model } from "../Engine/model/Model.js";
import { Renderer } from "../Engine/Renderer.js";
import { Shader } from "../Engine/Shader/Shader.js";
import { TextureShader } from "../Engine/Shader/textureShader.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { VBO } from "../Engine/VBO.js";
import { TexturedModel } from "../Engine/model/TexturedModel.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
export class Block
{
    static vertices =[
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
    static colors =[
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
        0.0,1.0,0.0,
    ]
    static indices =[
        2,1,0,3,0,2,
        6,5,4,7,4,6,
        10,9,8,11,8,10,
        14,13,12,15,12,14,
        18,17,16,19,16,18,
        22,21,20,23,20,22
    ]
    static texturec=  [
        0, 1,
        1, 1,
        1, 0,
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        0, 0,
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        0, 0
  ];
  static type = Object.freeze({
     AIR:0,
     DIRT:1 
  });
  static ready=false;
static onReady= function(){};
static model = null;
  static init()
  {
    this.shader = new TextureShader(gl);
    Block.texture.src = "/JS/Game/textures/dirt.png";
    Block.texture.addEventListener("load",()=>
    {
        Block.model = new TexturedModel(gl,Block.vertices,Block.indices,Block.texturec,Block.texture);
        this.ready=true;
        this.onReady();
    })
    
  }
    static texture = new Image(16,16); 
    constructor(gl,pos)
    {
     
   //    this.model =  new TexturedModel(gl,Block.vertices,Block.indices,Block.texturec,Block.texture);
        this.transformation = new Matrix();
        this.transformation[3] = pos.x;
        this.transformation[7] = pos.y;
        this.transformation[11] = pos.z;
       
    }
    static prepareRenderer()
    {
        Renderer.prepare(gl,Block.shader);
    }
    render(projection,view)
    {
        
     //    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, Block.texture);
        Renderer.renderTexture(gl,Block.model,Block.shader,this.transformation,projection,view);
    }
    static render(pos,type,projection,view)
    {
        let transformation = new Matrix();
       transformation =  transformation.translate(pos.x,pos.y,pos.z);
        Renderer.renderTexture(gl,Block.model,Block.shader,transformation,projection,view);
    }
}