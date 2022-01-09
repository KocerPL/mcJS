import {Canvas} from "./Engine/Canvas.js";
import { Loader } from "./Engine/Loader.js";
import { Pencil } from "./Engine/Pencil.js";
import { Renderer } from "./Engine/Renderer.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import  { math } from './LIB/Mathjs.js';
export class Main 
{
    static canva = new Canvas(document.body);
    static pencil = new Pencil(this.canva);
    static aspectRatio = this.canva.getHeight()/this.canva.getWidth();
    static projectMatrix = Matrix.projection(70,2,1000,this.aspectRatio);
  
    static xPos=0;
    static yPos=0;
    static zPos=0;
    static xRot=0;
    static yRot=0;
    static view = Matrix.viewFPS(this.xPos,this.yPos,this.zPos,this.xRot,this.yRot);
    //static viewMatrix =  Matrix.viewFPS(this.xPos,this.yPos,this.zPos,this.xRot,this.yRot);
    static run()
    {
        
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
        this.model = Loader.loadToVao(gl,vertices,colors,indices);
        this.model.transformation[11]=2;
        this.model2 = Loader.loadToVao(gl,vertices,colors,indices);
        this.model2.transformation[11]=10; 
        window.addEventListener('keydown',this.key.bind(this),false);
        window.addEventListener('mousemove',this.mm.bind(this),false);
       requestAnimationFrame(this.loop.bind(this));
        console.log("okj");
        console.log(this.viewMatrix)
        this.output = document.createElement('output');
        this.output.style = 'position:absolute; top:0; left:0; z-index:1; color:white';
        document.body.appendChild(this.output);
      
    }
    static key(ev)
    {
        if(ev.keyCode==37)
        {
            this.yRot+=2;
        }
        else if(ev.keyCode==39)
        {
            this.yRot-=2;
        }
        if(ev.keyCode==38)
        {
            this.xRot-=2;
        }
        else if(ev.keyCode==40)
        {
            this.xRot+=2;
        }
        if(ev.keyCode==65)
        {

            this.xPos+=Math.cos(this.yRot*(Math.PI/180))*-0.1;
            this.zPos+=Math.sin(this.yRot*(Math.PI/180))*-0.1;
        }
        else if(ev.keyCode==68)
        {
            this.xPos+=Math.cos(this.yRot*(Math.PI/180))*0.1;
            this.zPos+=Math.sin(this.yRot*(Math.PI/180))*0.1;
        }
        if(ev.keyCode==87)
        {
            this.zPos+=Math.cos(this.yRot*(Math.PI/180))*0.1;
            this.xPos+=-Math.sin(this.yRot*(Math.PI/180))*0.1;
        }
        else if(ev.keyCode==83)
        {
            this.zPos+=Math.cos(this.yRot*(Math.PI/180))*-0.1;
            this.xPos+=-Math.sin(this.yRot*(Math.PI/180))*-0.1;
        }
        if(ev.keyCode==32)
        {
            this.yPos+=0.1;
        }
        else if(ev.keyCode==16)
        {
            this.yPos-=0.1;
        }
      //  this.viewMatrix = Matrix.viewFPS(this.xPos,this.yPos,this.zPos,this.xRot,this.yRot);
      this.view = Matrix.view(this.xPos,this.yPos,this.zPos,this.xRot,this.yRot);
    }
    static mm(ev)
    {
ev.preventDefault();
    }
    static loop()
    {
        this.output.value ="Pos: x:"+this.xPos+" y:"+this.yPos+" z:"+this.zPos+" Rot: x:"+this.xRot+" Rot: y:"+this.yRot; 
        //console.log(this.projectMatrix);
        Renderer.prepare(gl);
        Renderer.render(gl,this.model,this.canva.shader,this.projectMatrix,this.view);
        Renderer.render(gl,this.model2,this.canva.shader,this.projectMatrix,this.view);
        requestAnimationFrame(this.loop.bind(this));
    }
}
Main.run();