import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix } from "../../Engine/Utils/Matrix.js";
import { Vector } from "../../Engine/Utils/Vector.js";
import { Main } from "../../Main.js";
import { Entity } from "../Entity.js";
import { SubChunk } from "../SubChunk.js";
import { World } from "../World.js";
let gl = CanvaManager.gl;
export class Item extends Entity {
    type;
    cooldown = 40;
    lifeTime = 60000;
    rotation = 0;
    yAcc = 0;
    constructor(pos, type) {
        super(pos);
        this.type = type;
        this.prepareModel();
    }
    update(i) {
        if (this.cooldown > 0)
            this.cooldown--;
        this.lifeTime--;
        if (this.cooldown < 1 && Main.player.isTouching(this.pos)) {
            Main.player.pickupItem(this.type);
            Main.entities.splice(i, 1);
        }
        if (this.lifeTime < 1)
            Main.entities.splice(i, 1);
    }
    prepareModel() {
        this.rs.vertices = [...SubChunk.defVertices];
        this.rs.textureCoords = [...SubChunk.getTextureCords2(this.type, "front"), ...SubChunk.getTextureCords2(this.type, "back"),
            ...SubChunk.getTextureCords2(this.type, "left"), ...SubChunk.getTextureCords2(this.type, "right"),
            ...SubChunk.getTextureCords2(this.type, "bottom"), ...SubChunk.getTextureCords2(this.type, "top")];
        //     console.log(this.rs.textureCoords);
        this.rs.indices = [2, 1, 0, 2, 0, 3,
            6, 5, 4, 6, 4, 7, 10, 9, 8, 10, 8, 11, 14, 13, 12, 14, 12, 15, 18, 17, 16, 18, 16, 19, 22, 21, 20, 22, 20, 23];
        this.rs.lightLevels = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];
        this.rs.bufferArrays(this.rs.vertices, this.rs.textureCoords, this.rs.lightLevels, this.rs.indices);
    }
    render() {
        // console.log("rendered")
        try {
            if (World.getBlock(new Vector(this.pos.x, this.pos.y, this.pos.z)).id > 0)
                this.yAcc -= 0.01;
            else if (World.getBlock(new Vector(this.pos.x, this.pos.y - 0.5, this.pos.z)).id == 0)
                this.yAcc += 0.01;
            else
                this.yAcc = 0;
        }
        catch (erro) {
            this.lifeTime = 0;
        }
        this.pos.y -= this.yAcc;
        if (this.rotation < 360)
            this.rotation++;
        else {
            this.rotation = 0;
        }
        this.transformation = Matrix.identity();
        this.transformation = this.transformation.translate(this.pos.x, this.pos.y + (Math.abs(this.rotation - 180) / 360), this.pos.z);
        this.transformation = this.transformation.scale(0.3, 0.3, 0.3);
        this.transformation = this.transformation.rotateY(this.rotation);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, Texture.blocksGridTest);
        this.rs.vao.bind();
        // Main.shader.use();
        Main.shader.loadUniforms(Main.player.camera.getProjection(), this.transformation, Main.player.camera.getView(), 15);
        //     Main.shader.use();
        gl.drawElements(gl.TRIANGLES, this.rs.count, gl.UNSIGNED_INT, 0);
    }
}
