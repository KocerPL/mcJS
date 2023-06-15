import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix } from "../../Engine/Utils/Matrix.js";
import { Vector } from "../../Engine/Utils/Vector.js";
import { Main } from "../../Main.js";
import { Entity } from "../Entity.js";
import { SubChunk } from "../SubChunk.js";
const gl = CanvaManager.gl;
export class PlayerEntity extends Entity
{
    constructor(pos:Vector,id?)
    {
        super(pos,id);
        this.rs.resetArrays();
        this.rs.vertices =[...SubChunk.defVertices, -0.5,-0.7,-0.2,
            0.5,-0.7,-0.2,
            0.5,0.7,-0.2,
            -0.5,0.7,-0.2,
            -0.5,-0.7,0.2,
            0.5,-0.7,0.2,
            0.5,0.7,0.2,
            -0.5,0.7,0.2,
            //right body
            -0.5,-0.7,-0.2,
            -0.5,-0.7,0.2,
            -0.5,0.7,0.2,
            -0.5,0.7,-0.2,
            //left body
            0.5,-0.7,-0.2,
            0.5,-0.7,0.2,
            0.5,0.7,0.2,
            0.5,0.7,-0.2,
            //bottom body
            -0.5,-0.7,-0.2,
            0.5,-0.7,-0.2,
            0.5,-0.7,0.2,
            -0.5,-0.7,0.2,
            //top body
            -0.5,0.7,-0.2,
            0.5,0.7,-0.2,
            0.5,0.7,0.2,
            -0.5,0.7,0.2,
        ];
        this.rs.skyLight  = [14,14,14,14 ,14,14,14,14 ,14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, /*Body */ 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14, 14,14,14,14];
        this.rs.blockLight = this.rs.skyLight;
        let tc = [];
        const pushFunc = (ind)=>{
            tc=   tc.concat([
                Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].dy,0,
                Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].dy,0,
                Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].y,0,
                Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].y,0]);
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
        this.rs.textureCoords = tc;
        let array=[];
        for(let i=0;i<12;i++)
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
    render(): void {
        let transformation = Matrix.identity();
        //  transformation = transformation.rotateY(-this.camera.getYaw());
        // transformation = transformation.rotateX(-this.camera.getPitch());
        transformation =transformation.translate(this.pos.x,this.pos.y+0.5,this.pos.z);
        transformation = transformation.scale(0.4,0.4,0.4);
        Texture.skinAtlas.bind();
        this.rs.vao.bind();

        Main.atlasShader.use();
        Main.atlasShader.loadUniforms(Main.player.camera.getProjection(),transformation,Main.player.camera.getView(),15);
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,0);
        Main.atlasShader.loadTransformation( Matrix.identity().translate(this.pos.x,this.pos.y+0.15,this.pos.z).scale(0.51,0.51,0.51));
        //Body
        gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_INT,36*4);
        Main.shader.use();
    }
    
}