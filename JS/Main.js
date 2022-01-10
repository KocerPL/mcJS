import {Canvas} from "./Engine/Canvas.js";
import { Loader } from "./Engine/Loader.js";
import { Model } from "./Engine/model/Model.js";
import { Pencil } from "./Engine/Pencil.js";
import { Renderer } from "./Engine/Renderer.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { Block } from "./Game/Block.js";
export class Main 
{
    static canva = new Canvas(document.body);
    static pencil = new Pencil(this.canva);
    static aspectRatio = this.canva.getHeight()/this.canva.getWidth();
    static projectMatrix = Matrix.projection(70,2,1000,this.aspectRatio);
  static keys = new Array();
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
        let vertices = 
        [
                // przód
                -0.5,0.5,-0.5, 
                0.5,0.5,-0.5, 
                0.5,-0.5,-0.5,
                -0.5,-0.5,-0.5,
            //tył
            -0.5,0.5,0.5, 
             0.5,0.5,0.5, 
            0.5,-0.5,0.5,
            -0.5,-0.5,0.5,
            
        ];
        let indices = [
             //tył
             6,5,4,6,4,7,
            //przód
            2,1,0,2,0,3,
            //prawo
            2,5,1,2,6,5,
            //lewo
            4,3,0,3,7,4,
            //góra
            0,1,5,0,5,4,
            //dół
            3,2,6,3,6,7,
          
        ];
        let colors = 
        [
            0.0,1.0,0.0,
            0.0,1.0,0.0,
            0.0,1.0,0.0,
            0.0,1.0,0.0,
            1.0,0.0,0.0,
            1.0,0.0,0.0,
            1.0,0.0,0.0,
            1.0,0.0,0.0,
        ];
        let colors2 = 
        [
            0.368, 0.368, 0.368,
            0.368, 0.368, 0.368,
            0.368, 0.368, 0.368,
            0.368, 0.368, 0.368
        ];
        let vert2 = [
            -0.5,0.0,-0.5,
            -0.5,0.0,0.5, 
            0.5,0.0,0.5, 
            0.5,0.0,-0.5
        ]
        let indices2 = [
            2,1,0,2,0,3
        ]
        this.pencil.clear(0,1.0,0);
        let gl = this.canva.gl;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS)
        globalThis.gl = gl;
        this.mat= new Matrix();
        this.mat[0] = 1;
        this.mat = Matrix.transpose(this.mat);
        console.log(this.mat);
        this.mat = Matrix.transpose(this.mat);
        console.log(this.mat);
        console.log(Matrix.getDeterminant(new Float32Array([1,3,0,0,0,1,0,10,0,12,1,0,0,0,0,1])));
        this.model = new Model(gl,vertices,colors,indices);
       this.block = new Block(gl,new Vector(0,0,3));
      //  this.model2 = Loader.loadToVao(gl,vert2,colors2,indices2);
     //  this.model2.transformation= this.model2.transformation.scale(100,1,100);
     //   this.model2.transformation[11]=0; 
        window.addEventListener('keydown',this.keyDown.bind(this),false);
        window.addEventListener('keyup',this.keyUp.bind(this),false);
        window.addEventListener('mousemove',this.mm.bind(this),false);
       requestAnimationFrame(this.loop.bind(this));
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
    static loop()
    {
        this.output.value ="Pos: x:"+this.xPos+" y:"+this.yPos+" z:"+this.zPos+" Rot: x:"+this.xRot+" Rot: y:"+this.yRot; 
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
        Renderer.prepare(gl,this.canva.shader);
     //   this.model.transformation= this.model.transformation.rotateX(1);
    
          
                Renderer.render(gl,this.model,this.canva.shader,this.projectMatrix,this.view);
                this.block.render(gl,this.canva.shader,this.projectMatrix,this.view);
      //  Renderer.render(gl,this.model2,this.canva.shader,this.projectMatrix,this.view);
        requestAnimationFrame(this.loop.bind(this));
    }
}
Main.run();