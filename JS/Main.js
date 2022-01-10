import {Canvas} from "./Engine/Canvas.js";
import { Loader } from "./Engine/Loader.js";
import { Model } from "./Engine/model/Model.js";
import { Pencil } from "./Engine/Pencil.js";
import { Renderer } from "./Engine/Renderer.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { Block } from "./Game/Block.js";
import { Chunk } from "./Game/Chunk.js";
export class Main 
{
    static canva = new Canvas(document.body);
    static pencil = new Pencil(this.canva);
    static aspectRatio = this.canva.getHeight()/this.canva.getWidth();
    static projectMatrix = Matrix.projection(70,2,1000,this.aspectRatio);
  static keys = new Array();
  static Fps = 61;
  static Tps = 20;
  static TickLastTime=0;
  static lastTime =0;
  static frames = 0;
  static lastMeasure=0;
  static fpsMeasure=0;
  static tpsLastMeasure=0;
  static tpsMeasure = 0;
  static ticks = 0;

    static xPos=0;
    static yPos=0;
    static zPos=0;
    static xRot=0;
    static yRot=360;
    static view = Matrix.viewFPS(this.xPos,this.yPos,this.zPos,this.xRot,this.yRot);
    //static viewMatrix =  Matrix.viewFPS(this.xPos,this.yPos,this.zPos,this.xRot,this.yRot);
    static run()
    {
       this.canva.canva.onclick=(ev) =>{ this.canva.canva.requestPointerLock()};
        this.pencil.clear(0,1.0,0);
        let gl = this.canva.gl;
        window.gl = gl;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS)
        globalThis.gl = gl;
        window.addEventListener('keydown',this.keyDown.bind(this),false);
        window.addEventListener('keyup',this.keyUp.bind(this),false);
        window.addEventListener('mousemove',this.mm.bind(this),false);
        Block.onReady= ()=>
        {
            this.chunk = new Chunk(gl,0,0);
       requestAnimationFrame(this.loop.bind(this));
        }
        Block.init();
       
      
        console.log("okj");
        console.log(this.viewMatrix)
        this.output = document.createElement('output');
        this.output.style = 'position:absolute; top:0; left:0; z-index:1; color:white';
        document.body.appendChild(this.output);
   
    }
    static keyUp(ev)
    {
        this.keys[ev.keyCode] = false;
    }
    static keyDown(ev)
    {
        this.keys[ev.keyCode] = true;
       
      //  this.viewMatrix = Matrix.viewFPS(this.xPos,this.yPos,this.zPos,this.xRot,this.yRot);
     
    }
    static mm(ev)
    {
      //  console.log(ev);
        
        this.yRot-= ev.movementX/20;
        this.xRot+= ev.movementY/20;
        if(this.xRot>90) this.xRot=90;
        if(this.xRot<-90) this.xRot=-90;
        while(this.yRot>360) this.yRot-=360;
        while(this.yRot<-360) this.yRot+=360;
ev.preventDefault();
    }
    static loop(time)
    {
        let delta = time-this.TickLastTime;
        delta = Math.round(delta/(1000/this.Tps));
        while(delta>0)
        {
            delta--;
        this.ticks++;
        this.TickLastTime=time;
        }
       
        if(this.tpsLastMeasure+1000<=time)
        {
            this.tpsMeasure = this.ticks;
            this.ticks=0;
            this.tpsLastMeasure=time;
        }
        this.output.value ="Pos: x:"+this.xPos+" y:"+this.yPos+" z:"+this.zPos+" Rot: x:"+this.xRot+" Rot: y:"+this.yRot+"\nFPS:"+this.fpsMeasure+"\n Tps:"+this.tpsMeasure; 
        //console.log(this.projectMatrix);
        if(this.keys[87])
        {
            this.zPos+=Math.cos((-this.yRot)*(Math.PI/180))*0.1;
            this.xPos+=Math.sin((-this.yRot)*(Math.PI/180))*0.1;
        }
        else if(this.keys[83])
        {
        
            this.zPos-=Math.cos((-this.yRot)*(Math.PI/180))*0.1;
            this.xPos-=Math.sin((-this.yRot)*(Math.PI/180))*0.1;
        }
        if(this.keys[65])
        {
            this.zPos+=Math.cos((-this.yRot+90)*(Math.PI/180))*-0.1;
            this.xPos+=Math.sin((-this.yRot+90)*(Math.PI/180))*-0.1;
        }
        else if(this.keys[68])
        {
            this.zPos+=Math.cos((-this.yRot+90)*(Math.PI/180))*0.1;
            this.xPos+=Math.sin((-this.yRot+90)*(Math.PI/180))*0.1;
         
        }
        if(this.keys[32])
        {
            this.yPos+=0.1;
        }
        else if(this.keys[16])
        {
            this.yPos-=0.1;
        }
        this.view = Matrix.viewFPS(new Vector(this.xPos,this.yPos,this.zPos),-this.yRot,-this.xRot);
        if(this.lastTime+1000/this.Fps<=time)
        {
     this.frames++;
       // Renderer.prepare(gl,this.canva.shader);
     //   this.model.transformation= this.model.transformation.rotateX(1);
     this.chunk.render(this.projectMatrix,this.view);
        } 
        if(this.lastMeasure+1000<=time)
        {
            this.fpsMeasure = this.frames;
            this.frames=0;
            this.lastMeasure=time;
        }
             //   Renderer.render(gl,this.model,this.canva.shader,this.projectMatrix,this.view);
             //   this.block.render(gl,this.projectMatrix,this.view);
      //  Renderer.render(gl,this.model2,this.canva.shader,this.projectMatrix,this.view);
        requestAnimationFrame(this.loop.bind(this));
    }
}
Main.run();