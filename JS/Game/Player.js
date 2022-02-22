import { Camera } from "../Engine/Camera.js";
import { CanvaManager } from "../Engine/CanvaManager.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { Main } from "../Main.js";
export class Player {
    camera = new Camera();
    pos;
    constructor(pos) {
        this.pos = pos;
        this.camera.setPosition(new Vector(pos.x, pos.y + 1, pos.z));
    }
    updatePos() {
        if (CanvaManager.getKey(87)) {
            this.pos.x += Math.sin(this.camera.getYaw() * Math.PI / 180) * 0.1;
            this.pos.z += Math.cos(this.camera.getYaw() * Math.PI / 180) * 0.1;
        }
        else if (CanvaManager.getKey(83)) {
            this.pos.x -= Math.sin(this.camera.getYaw() * Math.PI / 180) * 0.1;
            this.pos.z -= Math.cos(this.camera.getYaw() * Math.PI / 180) * 0.1;
        }
        if (CanvaManager.getKey(68)) {
            this.pos.x += Math.sin((this.camera.getYaw() + 90) * Math.PI / 180) * 0.1;
            this.pos.z += Math.cos((this.camera.getYaw() + 90) * Math.PI / 180) * 0.1;
        }
        else if (CanvaManager.getKey(65)) {
            this.pos.x -= Math.sin((this.camera.getYaw() + 90) * Math.PI / 180) * 0.1;
            this.pos.z -= Math.cos((this.camera.getYaw() + 90) * Math.PI / 180) * 0.1;
        }
        if (CanvaManager.getKey(32))
            this.pos.y += 0.1;
        else if (CanvaManager.getKey(16))
            this.pos.y -= 0.1;
        this.camera.setPitch(this.camera.getPitch() - (CanvaManager.mouseMovement.y / 10));
        this.camera.setYaw(this.camera.getYaw() + (CanvaManager.mouseMovement.x / 10));
        if (this.camera.getPitch() > 90)
            this.camera.setPitch(90);
        if (this.camera.getPitch() < -90)
            this.camera.setPitch(-90);
        if (CanvaManager.mouse.left)
            this.mine();
        if (CanvaManager.mouse.right)
            this.place();
        this.camera.setPosition(new Vector(this.pos.x, this.pos.y + 1, this.pos.z));
    }
    mine() {
        let blockPos = new Vector(Math.round(this.pos.x), Math.round(this.pos.y + 1), Math.round(this.pos.z));
        if (true == true || (blockPos.x > 0 && blockPos.x < 250 && blockPos.y > 0 && blockPos.y < 255 && blockPos.z > 0 && blockPos.z < 250)) {
            let inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
            let chunkPos = new Vector(Math.round(blockPos.x / 16), Math.round(blockPos.y), Math.round(blockPos.z / 16));
            let i = 0;
            try {
                while (Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos) == 0 && i < 5) {
                    i++;
                    blockPos = new Vector(blockPos.x + (Math.sin(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180)), blockPos.y + (Math.sin(this.camera.getPitch() * Math.PI / 180)), blockPos.z + (Math.cos(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180)));
                    inChunkPos = new Vector(Math.round(Math.round(blockPos.x) % 16), Math.round(blockPos.y), Math.round(Math.round(blockPos.z) % 16));
                    chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
                }
                if (Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos) != 0) {
                    Main.chunks[chunkPos.x][chunkPos.z].setBlock(inChunkPos, 0);
                    console.log("mined block!!");
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    place() {
        let blockPos = new Vector(Math.round(this.pos.x), Math.round(this.pos.y + 1), Math.round(this.pos.z));
        if (true == true || (blockPos.x > 0 && blockPos.x < 250 && blockPos.y > 0 && blockPos.y < 255 && blockPos.z > 0 && blockPos.z < 250)) {
            let inChunkPos = new Vector(Math.round(blockPos.x) % 16, Math.round(blockPos.y), Math.round(blockPos.z) % 16);
            let chunkPos = new Vector(Math.round(blockPos.x / 16), Math.round(blockPos.y), Math.round(blockPos.z / 16));
            let i = 0;
            try {
                let lastPos = new Vector(0, 0, 0);
                while (Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos) == 0 && i < 6) {
                    lastPos = blockPos;
                    i++;
                    blockPos = new Vector(blockPos.x + (Math.sin(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180)), blockPos.y + (Math.sin(this.camera.getPitch() * Math.PI / 180)), blockPos.z + (Math.cos(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180)));
                    inChunkPos = new Vector(Math.round(Math.round(blockPos.x) % 16), Math.floor(blockPos.y), Math.round(Math.round(blockPos.z) % 16));
                    chunkPos = new Vector(Math.floor(Math.round(blockPos.x) / 16), Math.round(blockPos.y), Math.floor(Math.round(blockPos.z) / 16));
                }
                inChunkPos = new Vector(Math.round(Math.round(lastPos.x) % 16), Math.round(lastPos.y), Math.round(Math.round(lastPos.z) % 16));
                chunkPos = new Vector(Math.floor(Math.round(lastPos.x) / 16), Math.round(lastPos.y), Math.floor(Math.round(lastPos.z) / 16));
                if (Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos) == 0 && i != 6 && i != 0) {
                    Main.chunks[chunkPos.x][chunkPos.z].setBlock(inChunkPos, 1);
                    CanvaManager.mouse.right = false;
                    console.log("placed block!! at: ", blockPos);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
