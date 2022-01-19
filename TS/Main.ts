import { Camera } from "./Engine/Camera.js";
import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Texture } from "./Engine/Texture.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
import { SubChunk } from "./Game/SubChunk.js";
let gl = CanvaManager.gl;
 class Main
{
   public static FPS:number=61;
   public static TPS:number=20;
   public static Measure = {
      tps:0,
      fps:0,
      lastTime:0,
      ticks:0,
      frames:0
   }
   private static lastTick = 0;
   private static lastFrame=0;
   private static shader:DefaultShader;
   private static TESTtransf = Matrix.identity();
   private static delta = 0;
   private static camera = new Camera();
   private static test = new SubChunk();
   private static count = 3;
   private static vao:VAO;
   private static vbo:VBO;
   private static tco:VBO;
   private static ebo:EBO;
   public static run():void
   {
      CanvaManager.setupCanva(document.body);
     let  vertices =[
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
  let indices =[
   2,1,0,3,0,2,
   6,5,4,7,4,6,
   10,9,8,11,8,10,
   14,13,12,15,12,14,
   18,17,16,19,16,18,
   22,21,20,23,20,22
];
let   colors =[
   0.0,1.0,0.0,
   0.0,1.0,0.0,
   0.0,1.0,0.0,
   0.0,1.0,0.0,
   1.0,1.0,0.0,
   1.0,1.0,0.0,
   1.0,1.0,0.0,
   1.0,1.0,0.0,
   1.0,0.0,0.0,
   1.0,0.0,0.0,
   1.0,0.0,0.0,
   1.0,0.0,0.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,0.1,1.0,
   0.0,0.1,1.0,
   0.0,0.1,1.0,
   0.0,0.1,1.0,
   1.0,1.0,1.0,
   1.0,1.0,1.0,
   1.0,1.0,1.0,
   1.0,1.0,1.0
]
let test = this.test;
     this.vao = new VAO();
     this.vao.bind();
     this.vbo = new VBO();
     this.vbo.bufferData(test.vertices);
    
     this.vao.addPtr(0,3,0,0);
     this.tco = new VBO();
      this.tco.bufferData(test.colors);
      this.vao.addPtr(1,2,0,0);
     this.ebo = new EBO();
     this.ebo.bufferData(test.indices);
    // EBO.unbind();
    // VBO.unbind();
    gl.enable(gl.DEPTH_TEST);
     this.shader = new DefaultShader();
     let texture =gl.createTexture();
     gl.bindTexture(gl.TEXTURE_2D,texture);
     gl.activeTexture(gl.TEXTURE0);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([0, 0, 255, 255]));
     Texture.blocksGrid.onload = ()=>{
      gl.bindTexture(gl.TEXTURE_2D,texture);  
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE,Texture.blocksGrid);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
         gl.generateMipmap(gl.TEXTURE_2D);
         console.log("okok");
      };
     if(Texture.blocksGrid.complete)
     {
      Texture.blocksGrid.onload(new Event("loaded"));
     }
     
 //   this.TESTtransf = this.TESTtransf.scale(2,1,1);
     requestAnimationFrame(this.loop.bind(this));
    
   }
   public static loop(time:number):void
   {
      if(this.Measure.lastTime <= time-1000)
      {
         this.Measure.lastTime = time;
         this.Measure.tps = this.Measure.ticks;
         this.Measure.ticks=0;
         this.Measure.fps = this.Measure.frames;
         this.Measure.frames = 0;
         CanvaManager.debug.value = "Fps: "+this.Measure.fps+ " Tps:"+this.Measure.tps;
       
      }
      let delta = time-this.lastTick;
      this.delta += delta/(2000/this.TPS);
     // console.log(this.delta);
      if(this.delta>=1) this.lastTick=time;
      while(this.delta>=1)
      {
      this.delta--;
      this.update();
      };
     if(this.lastFrame < time-(1000/this.FPS))
     {
      this.render();
      this.lastFrame= time;
     }
  
      requestAnimationFrame(this.loop.bind(this));
   }
   public static update()
   {
      this.Measure.ticks++;
      this.count++;
      if(this.count>this.test.indices.length)
      this.count=3;
      if(Math.floor(Math.random()*50) == 1)
      {
      this.test.blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
      this.test.updateVerticesIndices();
      this.ebo.bind();
      this.ebo.bufferData(this.test.indices);
      this.tco.bind();
      this.tco.bufferData(this.test.colors);
      this.vbo.bind();
      this.vbo.bufferData(this.test.vertices)
      }
    //  this.TESTtransf =  this.TESTtransf.rotateZ(1);
      //this.TESTtransf =  this.TESTtransf.rotateY(1);
   }
   public static render()
   {
      this.Measure.frames++;
      this.camera.preRender();
      CanvaManager.preRender();
      gl.clearColor(0.0,0.0,0.3,1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.shader.loadUniforms(this.camera.getProjection(),this.TESTtransf,this.camera.getView());
       gl.drawElements(gl.TRIANGLES,this.test.indices.length,gl.UNSIGNED_INT,0);
      
   }
}
Main.run();