import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
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
   private static camPos = new Vector(0,0,0);
   private static proj = Matrix.projection(70,1,100,CanvaManager.getHeight/CanvaManager.getWidth)
   private static view = Matrix.viewFPS(new Vector(0,0,0),0,0);
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
   1.0,0.0,0.0,
   1.0,0.0,0.0,
   1.0,0.0,0.0,
   1.0,0.0,0.0,
   1.0,0.0,0.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   0.0,1.0,1.0,
   1.0,1.0,1.0,
   1.0,1.0,1.0,
   1.0,1.0,1.0,
   1.0,1.0,1.0,
]
     let vao = new VAO();
     vao.bind();
     let vbo = new VBO();
     vbo.bufferData(vertices);
    
     vao.addPtr(0,3,0,0);
     let vco = new VBO();
      vco.bufferData(colors);
      vao.addPtr(1,3,0,0);
     let ebo = new EBO();
     ebo.bufferData(indices);
    // EBO.unbind();
    // VBO.unbind();
    gl.enable(gl.DEPTH_TEST);
     this.shader = new DefaultShader();
     this.TESTtransf = this.TESTtransf.translate(0,0,3);
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
      this.TESTtransf =  this.TESTtransf.rotateZ(1);
      this.TESTtransf =  this.TESTtransf.rotateY(1);
   }
   public static render()
   {
      this.Measure.frames++;
      this.proj = Matrix.projection(70,1,100,CanvaManager.getHeight/CanvaManager.getWidth);
      gl.clearColor(0,0.5,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.shader.loadUniforms(this.proj,this.TESTtransf,this.view);
       gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,0);
       if(CanvaManager.getKey(87))
       this.camPos.z+=1;
       this.view = Matrix.viewFPS(this.camPos,0,0);
   }
}
Main.run();