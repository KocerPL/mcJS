import { Camera } from "./Engine/Camera.js";
import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Texture } from "./Engine/Texture.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
import { Chunk } from "./Game/Chunk.js";
import { SubChunk } from "./Game/SubChunk.js";
let gl = CanvaManager.gl;
export class Main
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
   public static shader:DefaultShader;
   private static delta = 0;
   public static camera = new Camera();
   private static test:Chunk;
   public static run():void
   {
      CanvaManager.setupCanva(document.body);
    //TODO:Move this code to subchunk
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
      SubChunk.init();
     if(Texture.blocksGrid.complete)
     {
      Texture.blocksGrid.onload(new Event("loaded"));
     }
     this.test = new Chunk(0,0);
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
      if(this.delta>100) {
         console.log("Is game overloaded? Skipping "+delta+"ms")
         this.delta = 0;
       
      }
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
     // this.count++;
     // if(this.count>this.test.indices.length)
      //this.count=3;
      if(false &&Math.floor(Math.random()*50) == 1)
      {
    //  this.test.blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
      //this.test.updateVerticesIndices();
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
    this.test.render();
      
   }
}
Main.run();