import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix } from "../../Engine/Utils/Matrix.js";
import { Vector } from "../../Engine/Utils/Vector.js";
import { Main } from "../../Main.js";
import { Entity } from "../Entity.js";
const gl = CanvaManager.gl;
export class PlayerEntity extends Entity {
    rotation;
    constructor(pos, id) {
        super(pos, id);
        this.rotation = new Vector(0, 0, 0);
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
            -0.5, -0.7, -0.2,
            0.5, -0.7, -0.2,
            0.5, 0.7, -0.2,
            -0.5, 0.7, -0.2,
            //back body
            -0.5, -0.7, 0.2,
            0.5, -0.7, 0.2,
            0.5, 0.7, 0.2,
            -0.5, 0.7, 0.2,
            //right body
            -0.5, -0.7, -0.2,
            -0.5, -0.7, 0.2,
            -0.5, 0.7, 0.2,
            -0.5, 0.7, -0.2,
            //left body
            0.5, -0.7, -0.2,
            0.5, -0.7, 0.2,
            0.5, 0.7, 0.2,
            0.5, 0.7, -0.2,
            //bottom body
            -0.5, -0.7, -0.2,
            0.5, -0.7, -0.2,
            0.5, -0.7, 0.2,
            -0.5, -0.7, 0.2,
            //top body
            -0.5, 0.7, -0.2,
            0.5, 0.7, -0.2,
            0.5, 0.7, 0.2,
            -0.5, 0.7, 0.2,
            //front leg
            -0.25, -0.7, -0.2,
            0.25, -0.7, -0.2,
            0.25, 0.7, -0.2,
            -0.25, 0.7, -0.2,
            //back leg
            -0.25, -0.7, 0.2,
            0.25, -0.7, 0.2,
            0.25, 0.7, 0.2,
            -0.25, 0.7, 0.2,
            //left leg
            0.25, -0.7, -0.2,
            0.25, -0.7, 0.2,
            0.25, 0.7, 0.2,
            0.25, 0.7, -0.2,
            //right leg
            -0.25, -0.7, -0.2,
            -0.25, -0.7, 0.2,
            -0.25, 0.7, 0.2,
            -0.25, 0.7, -0.2,
            //top leg
            -0.25, 0.7, -0.2,
            0.25, 0.7, -0.2,
            0.25, 0.7, 0.2,
            -0.25, 0.7, 0.2,
            //bottom leg
            -0.25, -0.7, -0.2,
            0.25, -0.7, -0.2,
            0.25, -0.7, 0.2,
            -0.25, -0.7, 0.2,
            //front leg
            -0.25, -0.7, -0.2,
            0.25, -0.7, -0.2,
            0.25, 0.7, -0.2,
            -0.25, 0.7, -0.2,
            //back leg
            -0.25, -0.7, 0.2,
            0.25, -0.7, 0.2,
            0.25, 0.7, 0.2,
            -0.25, 0.7, 0.2,
            //left leg
            0.25, -0.7, -0.2,
            0.25, -0.7, 0.2,
            0.25, 0.7, 0.2,
            0.25, 0.7, -0.2,
            //right leg
            -0.25, -0.7, -0.2,
            -0.25, -0.7, 0.2,
            -0.25, 0.7, 0.2,
            -0.25, 0.7, -0.2,
            //top leg
            -0.25, 0.7, -0.2,
            0.25, 0.7, -0.2,
            0.25, 0.7, 0.2,
            -0.25, 0.7, 0.2,
            //bottom leg
            -0.25, -0.7, -0.2,
            0.25, -0.7, -0.2,
            0.25, -0.7, 0.2,
            -0.25, -0.7, 0.2,
        ];
        this.rs.skyLight = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, /*Body */ 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];
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
        this.rs.textureCoords = tc;
        let array = [];
        for (let i = 0; i < 24; i++) {
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
        let transformation = Matrix.identity();
        transformation = transformation.translate(this.pos.x, this.pos.y + 0.5, this.pos.z);
        transformation = transformation.scale(0.4, 0.4, 0.4);
        transformation = transformation.rotateY(this.rotation.y);
        transformation = transformation.rotateX(this.rotation.x);
        transformation = transformation.translate(0, 0.4, 0);
        Texture.skinAtlas.bind();
        this.rs.vao.bind();
        Main.atlasShader.use();
        Main.atlasShader.loadUniforms(Main.player.camera.getProjection(), transformation, Main.player.camera.getView(), 15);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y + 0.15, this.pos.z).scale(0.51, 0.51, 0.51).rotateY(this.rotation.y));
        //Body
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 36 * 4);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y - 0.20, this.pos.z).rotateY(this.rotation.y).rotateX(this.rotation.z).translate(-0.125, -0.35, 0).scale(0.51, 0.51, 0.51));
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 72 * 4);
        Main.atlasShader.loadTransformation(Matrix.identity().translate(this.pos.x, this.pos.y - 0.20, this.pos.z).rotateY(this.rotation.y).rotateX(-this.rotation.z).translate(0.125, -0.35, 0).scale(0.51, 0.51, 0.51));
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 108 * 4);
        Main.shader.use();
    }
}
