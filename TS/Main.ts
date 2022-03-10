import { Camera } from "./Engine/Camera.js";
import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Shader2d } from "./Engine/Shader/Shader2d.js";
import { Texture } from "./Engine/Texture.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
import { blocks } from "./Game/Block.js";
import { Chunk } from "./Game/Chunk.js";
import { GUI } from "./Game/GUI.js";
import { Player } from "./Game/Player.js";
import { SubChunk } from "./Game/SubChunk.js";
import { World } from "./Game/World.js";
let gl = CanvaManager.gl;
export class Main
{
   public static FPS:number=61;
   public static TPS:number=20;
   public static sunPos:Vector = new Vector(100,100,100);
   public static Measure = {
      tps:0,
      fps:0,
      lastTime:0,
      ticks:0,
      frames:0
   }
   private static shader2d:Shader2d;
   public static tasks:Array<Array<Function>> = new Array(11);
   private static lastTick = 0;
   private static lastFrame=0;
   public static shader:DefaultShader;
   private static delta = 0;
   private static crossVAO:VAO;
   public static player = new Player(new Vector(0,60,0));
   public static range = {start:-2, end:2};
   public static chunks:Array<Array<Chunk>>=new Array(8);
   private static crosscords = [
      -0.02,-0.02,
      0.02,0.02,
      -0.02,0.02,
      0.02,-0.02
   ]
   private static crosstcords = [
      0,0,
      9,9,
      0,9,
      9,0
   ]
   private static crossindices =[
      0,1,2, 3,1,0
   ]
   public static run():void
   {
      CanvaManager.setupCanva(document.body);
    // EBO.unbind();
    // VBO.unbind();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
   // gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);
    //Transparency requires blending 
    gl.enable (gl.BLEND);
   gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
   //Shader for world
     this.shader = new DefaultShader();
     //shader for GUI(2d)
     this.shader2d = new Shader2d();
     //loading crosshair 
     GUI.init();
     this.crossVAO = new VAO();
     let vbo = new VBO();
     vbo.bufferData(this.crosscords);
     this.crossVAO.addPtr(0,2,0,0);
     let vtc = new VBO();
     vtc.bufferData(this.crosstcords);
     this.crossVAO.addPtr(1,2,0,0);
    let ebo = new EBO();
    ebo.bufferData(this.crossindices);
    VAO.unbind();
    VBO.unbind();
    EBO.unbind();
    //init world
    World.init();
    for(let i=0;i<this.tasks.length;i++)
    {
       this.tasks[i]=new Array();
    }
     //loading chunks
     for(let x=this.range.start; x<this.range.end;x++)
     {
      this.chunks[x] = new Array(16);
      for(let z=this.range.start; z<this.range.end;z++)
       {
          if(x==this.range.start-1 ||x==this.range.end+1||z==this.range.start-1 || z==this.range.end+1   )
          this.chunks[x][z] =  new Chunk(x,z,true);
          else
         this.chunks[x][z] =  new Chunk(x,z,false);
       }
      }
    console.log(this.chunks);
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
       
      }
      let delta = time-this.lastTick;
      this.delta += delta/(2000/this.TPS);
     // console.log(this.delta);
      if(this.delta>=1) this.lastTick=time;
     
      while(this.delta>=1)
      {
         if(this.delta>100) {
            console.log("Is game overloaded? Skipping "+delta+"ms")
            this.delta = 0;
          
         }
      this.delta--;
      this.update();
      };
      let testTime = Date.now();
      if(this.Measure.fps>30)
      while(Date.now()-testTime <20 )
      {
         this.executeTasks(testTime);
        // this.chunksUpdate();
      }
     if(this.lastFrame < time-(1000/this.FPS))
     {
      this.render();
      this.lastFrame= time;
     }
  
      requestAnimationFrame(this.loop.bind(this));
   }
   private static executeTasks(time)
   {
      for(let i = this.tasks.length-1; i>=0;i--)
      {
         while(this.tasks[i].length>0)
         {
            let task = this.tasks[i].shift();
            task();
            if(Date.now()-time >20)
            return;
         }
      }
   }
   
   public static update()
   {
      
      this.Measure.ticks++;
     // this.count++;
     // if(this.count>this.test.indices.length)
      //this.count=3;
      GUI.update();
      if(Math.floor(Math.random()*50) == 1)
      {
         let rand = 0;
      //   this.test.subchunks[rand].blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
        // this.test.subchunks[rand].updateVerticesIndices();
    //  this.test.blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
      //this.test.updateVerticesIndices();
      }
    //  this.TESTtransf =  this.TESTtransf.rotateZ(1);
      //this.TESTtransf =  this.TESTtransf.rotateY(1);
   }
 
   public static render()
   {
      this.Measure.frames++;
      CanvaManager.debug.value = "Fps: "+this.Measure.fps+"Selected block: "+ blocks[this.player.itemsBar[this.player.selectedItem]].name;
      gl.bindTexture(gl.TEXTURE_2D_ARRAY,Texture.blocksGridTest);
      this.shader.use();
      this.player.camera.preRender();
      this.player.updatePos();
      CanvaManager.preRender();
      gl.clearColor(0.0,1.0,1.0,1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      for(let x=this.range.start; x<this.range.end;x++)     
      for(let z=this.range.start; z<this.range.end;z++)
       {
          let x2 =Math.floor(Math.round(this.player.pos.x)/16)+x;
          let z2 =Math.floor(Math.round(this.player.pos.z)/16)+z;
          if(this.chunks[x2]==undefined)
          this.chunks[x2] =new Array();
          if(this.chunks[x2][z2]==undefined)
          this.chunks[x2][z2]= new Chunk(x2,z2,false)
          if(this.chunks[x2][z2].lazy)
          this.chunks[x2][z2].generate();
         this.chunks[x2][z2].render();
       }
      //render crosshair
    
      GUI.render(this.shader2d);
   }
}
Main.run();