import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix } from "../../Engine/Utils/Matrix.js";
import { Vector } from "../../Engine/Utils/Vector.js";
import { Main } from "../../Main.js";
import { Entity } from "../Entity.js";
const gl = CanvaManager.gl;
export class PlayerEntity extends Entity {
    rotation;
    bodyRot;
    nextTransitions = [];
    constructor(pos, id) {
        super(pos, id);
        this.rotation = new Vector(0, 0, 0);
        this.bodyRot = 0;
        this.rs.resetArrays();
        this.rs.vertices = [
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            //tył
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            //lewo
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            //prawo
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            //dół
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            //góra
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            //front body
            -0.5, -0.7, -0.25,
            0.5, -0.7, -0.25,
            0.5, 0.7, -0.25,
            -0.5, 0.7, -0.25,
            //back body
            -0.5, -0.7, 0.25,
            0.5, -0.7, 0.25,
            0.5, 0.7, 0.25,
            -0.5, 0.7, 0.25,
            //right body
            -0.5, -0.7, -0.25,
            -0.5, -0.7, 0.25,
            -0.5, 0.7, 0.25,
            -0.5, 0.7, -0.25,
            //left body
            0.5, -0.7, -0.25,
            0.5, -0.7, 0.25,
            0.5, 0.7, 0.25,
            0.5, 0.7, -0.25,
            //bottom body
            -0.5, -0.7, -0.25,
            0.5, -0.7, -0.25,
            0.5, -0.7, 0.25,
            -0.5, -0.7, 0.25,
            //top body
            -0.5, 0.7, -0.25,
            0.5, 0.7, -0.25,
            0.5, 0.7, 0.25,
            -0.5, 0.7, 0.25,
            //front leg
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, 0.7, -0.25,
            -0.25, 0.7, -0.25,
            //back leg
            -0.25, -0.7, 0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //left leg
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            0.25, 0.7, -0.25,
            //right leg
            -0.25, -0.7, -0.25,
            -0.25, -0.7, 0.25,
            -0.25, 0.7, 0.25,
            -0.25, 0.7, -0.25,
            //top leg
            -0.25, 0.7, -0.25,
            0.25, 0.7, -0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //bottom leg
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            -0.25, -0.7, 0.25,
            //front leg
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, 0.7, -0.25,
            -0.25, 0.7, -0.25,
            //back leg
            -0.25, -0.7, 0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //left leg
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            0.25, 0.7, -0.25,
            //right leg
            -0.25, -0.7, -0.25,
            -0.25, -0.7, 0.25,
            -0.25, 0.7, 0.25,
            -0.25, 0.7, -0.25,
            //top leg
            -0.25, 0.7, -0.25,
            0.25, 0.7, -0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //bottom leg
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            -0.25, -0.7, 0.25,
            //arm
            //front arm
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, 0.7, -0.25,
            -0.25, 0.7, -0.25,
            //back arm
            -0.25, -0.7, 0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //left arm
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            0.25, 0.7, -0.25,
            //right arm
            -0.25, -0.7, -0.25,
            -0.25, -0.7, 0.25,
            -0.25, 0.7, 0.25,
            -0.25, 0.7, -0.25,
            //top arm
            -0.25, 0.7, -0.25,
            0.25, 0.7, -0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //bottom arm
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            -0.25, -0.7, 0.25,
            //arm
            //front arm
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, 0.7, -0.25,
            -0.25, 0.7, -0.25,
            //back arm
            -0.25, -0.7, 0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //left arm
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            0.25, 0.7, 0.25,
            0.25, 0.7, -0.25,
            //right arm
            -0.25, -0.7, -0.25,
            -0.25, -0.7, 0.25,
            -0.25, 0.7, 0.25,
            -0.25, 0.7, -0.25,
            //top arm
            -0.25, 0.7, -0.25,
            0.25, 0.7, -0.25,
            0.25, 0.7, 0.25,
            -0.25, 0.7, 0.25,
            //bottom arm
            -0.25, -0.7, -0.25,
            0.25, -0.7, -0.25,
            0.25, -0.7, 0.25,
            -0.25, -0.7, 0.25,
        ];
        this.rs.skyLight = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, /*Body */ 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,];
        this.rs.blockLight = this.rs.skyLight;
        let tc = [];
        const pushFunc = (ind) => {
            tc = tc.concat([
                Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].dy, 0,
                Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].dy, 0,
                Texture.skinAtlas.coords[ind].dx, Texture.skinAtlas.coords[ind].y, 0,
                Texture.skinAtlas.coords[ind].x, Texture.skinAtlas.coords[ind].y, 0
            ]);
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
        let array = [];
        for (let i = 0; i < 36; i++) {
            const k = 4 * i;
            array = array.concat([2 + k, 1 + k, k, 2 + k, 0 + k, 3 + k]);
        }
        this.rs.indices = array;
        this.rs.bufferArrays();
    }
    update(i) {
        i;
    }
    render() {
        const nTransition = this.nextTransitions.shift();
        if (nTransition != undefined) {
            this.pos = nTransition.pos;
            this.rotation = nTransition.rot;
        }
        let transformation = Matrix.identity();
        if (this.bodyRot - this.rotation.y > 45)
            this.bodyRot = this.rotation.y + 45;
        if (this.bodyRot - this.rotation.y < -45)
            this.bodyRot = this.rotation.y - 45;
        transformation = transformation.translate(this.pos.x, this.pos.y + 0.45, this.pos.z);
        transformation = transformation.scale(0.5, 0.5, 0.5);
        transformation = transformation.rotateY(this.rotation.y);
        transformation = transformation.rotateX(this.rotation.x);
        transformation = transformation.translate(0, 0.4, 0);
        Texture.skinAtlas.bind();
        this.rs.vao.bind();
        const bScale = 0.5;
        Main.atlasShader.use();
        Main.atlasShader.loadUniforms(Main.player.camera.getProjection(), transformation, Main.player.camera.getView(), 15);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y + 0.05, this.pos.z).scale(bScale, bScale, bScale).rotateY(this.bodyRot));
        //Body
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 36 * 4);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y - 0.30, this.pos.z).rotateY(this.bodyRot).rotateX(this.rotation.z).translate(-0.125, -0.35, 0).scale(bScale, bScale, bScale));
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 72 * 4);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y - 0.30, this.pos.z).rotateY(this.bodyRot).rotateX(-this.rotation.z).translate(0.125, -0.35, 0).scale(bScale, bScale, bScale));
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 108 * 4);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y + 0.40, this.pos.z).rotateY(this.bodyRot).rotateX(this.rotation.z).rotateZ(5).translate(0.375, -0.35, 0).scale(bScale, bScale, bScale));
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 144 * 4);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y + 0.40, this.pos.z).rotateY(this.bodyRot).rotateX(-this.rotation.z).rotateZ(-5).translate(-0.375, -0.35, 0).scale(bScale, bScale, bScale));
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 180 * 4);
        Main.shader.use();
    }
    setNextTransitions(nextPos, nextRot, count) {
        /*   const deltaPos = Vector.add(nextPos,this.pos.mult(-1));
        const deltaRot = Vector.add(nextRot,this.rotation.mult(-1));
        const OneStepPos = deltaPos.mult(1/count);
        const OneStepRot = deltaRot.mult(1/count);
        for(let i=1;i<count;i++)
        {
            this.nextTransitions.push({pos:Vector.add(this.pos,OneStepPos),rot:Vector.add(this.rotation,OneStepRot)});
        }*/
        this.nextTransitions.push({ pos: nextPos, rot: nextRot });
    }
}
