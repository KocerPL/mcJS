import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix4 } from "../../Engine/Utils/Matrix4.js";
import { Vector } from "../../Engine/Utils/Vector.js";
import { Main } from "../../Main.js";
import { Entity } from "../Entity.js";
import { rot2d } from "../Models.js";
import { Loader } from "../../Engine/Loader.js";
import { GameScene } from "../scenes/GameScene.js";
import { Item } from "./Item.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { World } from "../World.js";
import { Block } from "../Block.js";
const gl = CanvaManager.gl;
export class PlayerRotations
{
    body:Vector3=new Vector3(0,0,0);
    leftHand:Vector3 = new Vector3(0,0,-5);
    rightHand:Vector3= new Vector3(0,0,5);
    leftLeg:Vector3 = new Vector3(0,0,0);
    rightLeg:Vector3 = new Vector3(0,0,0);
    head:Vector3 = new Vector3(0,0,0);   
}
export class PlayerEntity extends Entity
{
    nextTransitions:Array<{pos:Vector,rots:PlayerRotations}>=[];
    itemEnt:Item;
    rotations:PlayerRotations = new PlayerRotations();
    // rsHammer = Loader.loadObj("./res/models/hammer.obj");
    gs:GameScene;
    constructor(pos:Vector,gs:GameScene,id?)
    {
        super(pos,Main.atlasShader,id);
        this.gs = gs;
        
        this.itemEnt =  new Item(new Vector(0,0,0),1,this.gs,0);
        this.rs.resetArrays();
        this.rs.vertices =[ //tył
            -0.5,-0.5,-0.5,
            -0.5,0.5,-0.5,
            0.5,0.5,-0.5,
            0.5,-0.5,-0.5,
            //przóð
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
            0.5,-0.5,0.5,
            0.5,-0.5,-0.5,
            0.5,0.5,-0.5,
            0.5,0.5 ,0.5,
            //dół
            0.5,-0.5,0.5,
            -0.5,-0.5,0.5,
            -0.5,-0.5,-0.5,
            0.5,-0.5,-0.5,
           
            //góra
            -0.5,0.5,-0.5,
            -0.5,0.5,0.5,
            0.5,0.5 ,0.5,
            0.5,0.5,-0.5,
            //back body
            -0.5,-0.7,-0.25,
            -0.5,0.7,-0.25,
            0.5,0.7,-0.25,
            0.5,-0.7,-0.25,
            //front body
            -0.5,-0.7,0.25,
            0.5,-0.7,0.25,
            0.5,0.7,0.25,
            -0.5,0.7,0.25,
            //right body
            -0.5,-0.7,-0.25,
            -0.5,-0.7,0.25,
            -0.5,0.7,0.25,
            -0.5,0.7,-0.25,
            //left body
            0.5,-0.7,-0.25,
            0.5,0.7,-0.25,
            0.5,0.7,0.25,
            0.5,-0.7,0.25,
            //bottom body
            -0.5,-0.7,-0.25,
            0.5,-0.7,-0.25,
            0.5,-0.7,0.25,
            -0.5,-0.7,0.25,
            //top body
            -0.5,0.7,-0.25,
            -0.5,0.7,0.25,
            0.5,0.7,0.25,
            0.5,0.7,-0.25,
            //back leg
            -0.25,-0.7,-0.25,
            -0.25,0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,-0.7,-0.25,
            //front leg
            -0.25,-0.7,0.25,
            0.25,-0.7,0.25,
            0.25,0.7,0.25,
            -0.25,0.7,0.25,
            //left leg
            0.25,-0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,0.7,0.25,
            0.25,-0.7,0.25,
            //right leg
            -0.25,-0.7,-0.25,
            -0.25,-0.7,0.25,
            -0.25,0.7,0.25,
            -0.25,0.7,-0.25,
            //top leg
            -0.25,0.7,-0.25,
            -0.25,0.7,0.25,
            0.25,0.7,0.25,
            0.25,0.7,-0.25,       
            //bottom leg
            -0.25,-0.7,-0.25,
            0.25,-0.7,-0.25,
            0.25,-0.7,0.25,
            -0.25,-0.7,0.25,
            //back leg
            -0.25,-0.7,-0.25,
            -0.25,0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,-0.7,-0.25,
            //front leg
            -0.25,-0.7,0.25,
            0.25,-0.7,0.25,
            0.25,0.7,0.25,
            -0.25,0.7,0.25,
            //left leg
            0.25,-0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,0.7,0.25,
            0.25,-0.7,0.25, 
            //right leg
            -0.25,-0.7,-0.25,
            -0.25,-0.7,0.25,
            -0.25,0.7,0.25,
            -0.25,0.7,-0.25,
            //top leg
            -0.25,0.7,-0.25,
            -0.25,0.7,0.25,
            0.25,0.7,0.25,
            0.25,0.7,-0.25,
            //bottom leg
            -0.25,-0.7,-0.25,
            0.25,-0.7,-0.25,
            0.25,-0.7,0.25,
            -0.25,-0.7,0.25,
            //arm
            //back arm
            -0.25,-0.7,-0.25,
            -0.25,0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,-0.7,-0.25,
            //front arm
            -0.25,-0.7,0.25,
            0.25,-0.7,0.25,
            0.25,0.7,0.25,
            -0.25,0.7,0.25,
            //left arm
            0.25,-0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,0.7,0.25,
            0.25,-0.7,0.25,
            //right arm
            -0.25,-0.7,-0.25,
            -0.25,-0.7,0.25,
            -0.25,0.7,0.25,
            -0.25,0.7,-0.25,
            //top arm
            0.25,0.7,0.25,
            0.25,0.7,-0.25,
            -0.25,0.7,-0.25,
            -0.25,0.7,0.25,
            //bottom arm
            -0.25,-0.7,-0.25,
            0.25,-0.7,-0.25,
            0.25,-0.7,0.25,
            -0.25,-0.7,0.25,
            //arm
            //back arm
            -0.25,-0.7,-0.25,
            -0.25,0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,-0.7,-0.25,
            //front arm
            -0.25,-0.7,0.25,
            0.25,-0.7,0.25,
            0.25,0.7,0.25,
            -0.25,0.7,0.25,
            //left arm
            0.25,-0.7,-0.25,
            0.25,0.7,-0.25,
            0.25,0.7,0.25,
            0.25,-0.7,0.25,
            //right arm
            -0.25,-0.7,-0.25,
            -0.25,-0.7,0.25,
            -0.25,0.7,0.25,
            -0.25,0.7,-0.25,
            //top arm
            0.25,0.7,0.25,
            0.25,0.7,-0.25,
            -0.25,0.7,-0.25,
            -0.25,0.7,0.25,
            //bottom arm
            -0.25,-0.7,-0.25,
            0.25,-0.7,-0.25,
            0.25,-0.7,0.25,
            -0.25,-0.7,0.25,
        ];
        this.rs.skyLight  = [14,14,14,14 ,14,14,14,14 ,14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, /*Body */ 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14,14,14,14,14, 14,14,14,14,   14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14,14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14,];
        this.rs.blockLight = this.rs.skyLight;
        let tc = [];
        const pushFunc = (ind)=>{
            if(Texture.skinAtlas.coords[ind].rotation == undefined)
                tc=   tc.concat([
                    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].dy,
                    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].dy,
                    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].y,
                    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].y,]);
            else if(Texture.skinAtlas.coords[ind].rotation==rot2d.D90)
            {
                tc=   tc.concat([
                    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].dy,
                    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].y,
                    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].y,
                    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].dy,]);
            }
            else if(Texture.skinAtlas.coords[ind].rotation==rot2d.D180)
            {
                tc=   tc.concat([
                    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].y,
                    Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].dy,
                    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].dy,
                    Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].y,
                ] );
            }

        };
        pushFunc(1);
        pushFunc(0);
        pushFunc(2);
        pushFunc(3);
        pushFunc(5);
        pushFunc(4);
        pushFunc(7);
        pushFunc(6);
        pushFunc(9);
        pushFunc(8);
        pushFunc(11);
        pushFunc(10);
        pushFunc(12);
        pushFunc(13);
        pushFunc(14);
        pushFunc(15);
        pushFunc(16);
        pushFunc(17);
        pushFunc(18);
        pushFunc(19);
        pushFunc(20);
        pushFunc(21);
        pushFunc(22);
        pushFunc(23);

        pushFunc(24);
        pushFunc(25);
        pushFunc(26);
        pushFunc(27);
        pushFunc(28);
        pushFunc(29);

        pushFunc(30);
        pushFunc(31);
        pushFunc(32);
        pushFunc(33);
        pushFunc(34);
        pushFunc(35);
        this.rs.textureCoords = tc;
        let array=[];
        for(let i=0;i<36;i++)
        {
            const k = 4*i;
            array =    array.concat([2+k,1+k,k,2+k,0+k,3+k]);
        }
        this.rs.indices = array;
        this.rs.bufferArrays();
    }
    update(i: number): void {
        i;
    }
    updatePos()
    {
        const nTransition = this.nextTransitions.shift();
        if(nTransition!=undefined)
        {
            this.pos=nTransition.pos;
            this.rotations= nTransition.rots;
        }
    }
    render(): void {
        this.updatePos();
        let transformation = Matrix4.identity();
        transformation =transformation.translate(this.pos.x,this.pos.y+0.45,this.pos.z);
        transformation = transformation.scale(0.5,0.5,0.5);
        transformation = transformation.rotateY(this.rotations.body.y+this.rotations.head.y);
        transformation = transformation.rotateX(this.rotations.head.x).rotateY(this.rotations.head.y).rotateZ(this.rotations.head.z);
        transformation = transformation.translate(0,0.4,0);
        Texture.skinAtlas.bind();
        this.rs.vao.bind();
        const bScale = 0.5;
        Main.atlasShader.use();
        let block = World.getBlock(this.pos,this.gs);
        if(!block) block = new Block(0);
        Main.atlasShader.loadUniforms(this.gs.player.camera.getProjection(),transformation,this.gs.player.camera.getView(),Math.max(block.lightFBlock,Math.min(block.skyLight,this.gs.sunLight)));
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,0);
        //Body
        Main.atlasShader.loadTransformation( Matrix4.identity().translate(this.pos.x,this.pos.y+0.05,this.pos.z).scale(bScale ,bScale ,bScale ).rotateX(this.rotations.body.x).rotateY(this.rotations.body.y).rotateZ(this.rotations.body.z));
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,36*4);
        //left legWWWWW
        Main.atlasShader.loadTransformation( Matrix4.identity().translate(this.pos.x,this.pos.y-0.30,this.pos.z).rotateY(this.rotations.body.y).translate(-0.125,0,0).rotateX(this.rotations.leftLeg.x).rotateY(this.rotations.leftLeg.y).rotateZ(this.rotations.leftLeg.z).translate(0,-0.35,0).scale(bScale ,bScale ,bScale ));
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,72*4);
        //Right leg
        Main.atlasShader.loadTransformation( Matrix4.identity().translate(this.pos.x,this.pos.y-0.30,this.pos.z).rotateY(this.rotations.body.y).translate(0.125,0,0).rotateX(this.rotations.rightLeg.x).rotateY(this.rotations.leftLeg.y).rotateZ(this.rotations.leftLeg.z).translate(0,-0.35,0).scale(bScale ,bScale ,bScale ));
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,108*4);
  
        //Left hand
        const mat = Matrix4.identity().translate(this.pos.x,this.pos.y+0.40,this.pos.z).rotateY(this.rotations.body.y).translate(-0.375,0,0).rotateX(this.rotations.leftHand.x).rotateY(this.rotations.leftHand.y).rotateZ(this.rotations.leftHand.z).translate(0,-0.35,0).scale(bScale ,bScale ,bScale );
        Main.atlasShader.loadTransformation(mat);
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,180*4);
        //Right Hand
        Main.atlasShader.loadTransformation( Matrix4.identity().translate(this.pos.x,this.pos.y+0.40,this.pos.z).rotateY(this.rotations.body.y).translate(0.375,0,0).rotateX(this.rotations.rightHand.x).rotateY(this.rotations.rightHand.y).rotateZ(this.rotations.rightHand.z).translate(0,-0.35,0).scale(bScale ,bScale ,bScale ));
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,144*4);
        //  this.renderHandItem();
        Main.shader.use();
    }
    renderHandItem(id:number)
    {
    /*    Texture.skinAtlas.bind();
        this.rs.vao.bind();
        const cScale = 0.5;
        Main.atlasShader.use();
        Main.atlasShader.loadUniforms(this.gs.player.camera.getProjection(),Matrix4.identity().translate(this.pos.x,this.pos.y+0.40,this.pos.z).rotateY(this.rotations.body.y).translate(0.375,0,0).rotateX(this.rotations.rightHand.x).rotateY(this.rotations.rightHand.y).rotateZ(this.rotations.rightHand.z).translate(0,-0.35,0).scale(cScale ,cScale ,cScale ),this.gs.player.camera.getView(),15);
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,144*4);
         */
        const bScale = 0.3;
        const isRightHanded = true;
       
        let mat = Matrix4.identity().translate(this.pos.x,this.pos.y+0.45,this.pos.z).rotateY(this.rotations.body.y);
        if(isRightHanded)
            mat =mat.rotateX(this.rotations.rightHand.x).rotateZ(5).translate( isRightHanded?0.375:-0.375,-0.8,0.2);
        else
            mat =mat.rotateX(-this.rotations.leftHand.x).rotateZ(-5).translate(-0.375,-0.7,0.2);

        mat = mat.rotateY(-90).rotateY(45).rotateZ(30).scale(bScale ,bScale ,bScale );
        if(id!=0)
        {
            Main.shader.use();
            Texture.blockAtlas.bind();
            if(id!=this.itemEnt.type)
            {
                this.itemEnt.type =id; 
                this.itemEnt.prepareModel();
                this. itemEnt.bufferWithDummyLight();
                console.log("changing: "+id);
            }
            
            //  this.itemEnt.pos   = new Vector(this.pos.x,this.pos.y+0.45,this.pos.z);
            this.itemEnt.render(mat);
        }      
        
        //  this.rsHammer.vao.bind();
        //gl.bindTexture(gl.TEXTURE_2D,Texture.hammer);
        //Main.atlasShader.loadUniforms(this.gs.player.camera.getProjection(),mat,this.gs.player.camera.getView(),15);
        //gl.drawElements(gl.TRIANGLES,this.rsHammer.count,gl.UNSIGNED_INT,0);
    }
    setNextTransitions(nextPos:Vector,nextRots:PlayerRotations,count:number)
    {
        const deltaPos = Vector.add(nextPos,this.nextTransitions.length>0?this.nextTransitions.at(-1).pos.mult(-1):this.pos.mult(-1));
        const deltaRots = new PlayerRotations();
        for(const name in this.rotations)
        {
            deltaRots[name] =    nextRots[name].add(this.nextTransitions.length>0?this.nextTransitions.at(-1).rots[name].mult(-1):this.rotations[name].mult(-1));
        }
        const OneStepPos = deltaPos.mult(1/count);
        const OneStepRots  = new PlayerRotations();
        for(const name in deltaRots)
        {
            OneStepRots[name] = this.rotations[name].add( deltaRots[name].mult(1/count));
        }
        for(let i=1;i<count;i++)
        {
            this.nextTransitions.push({pos:Vector.add(this.pos,OneStepPos),rots:OneStepRots});
        }
        this.nextTransitions.push({pos:nextPos,rots:OneStepRots});
     
    }
}