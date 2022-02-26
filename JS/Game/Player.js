import { Camera } from "../Engine/Camera.js";
import { CanvaManager } from "../Engine/CanvaManager.js";
import { Vector } from "../Engine/Utils/Vector.js";
import { World } from "./World.js";
export class Player {
    camera = new Camera();
    pos;
    itemsBar = [1, 1, 2, 3, 4, 5, 6, 3, 3];
    selectedItem = 0;
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
        if (CanvaManager.scrollAmount != 0) {
            this.selectedItem += CanvaManager.scrollAmount;
            CanvaManager.scrollAmount = 0;
            while (this.selectedItem > 8) {
                this.selectedItem -= 9;
            }
            while (this.selectedItem < 0) {
                this.selectedItem += 9;
            }
        }
        if (CanvaManager.mouse.left)
            this.mine();
        if (CanvaManager.mouse.right)
            this.place();
        this.camera.setPosition(new Vector(this.pos.x, this.pos.y + 1, this.pos.z));
    }
    mine() {
        let dist = 0.1;
        let blockPos = new Vector(Math.round(this.pos.x), Math.round(this.pos.y + 1), Math.round(this.pos.z));
        let i = 0;
        try {
            while (World.getBlock(blockPos).id == 0 && i < 5) {
                i += dist;
                blockPos = new Vector(blockPos.x + (Math.sin(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180) * dist), blockPos.y + (Math.sin(this.camera.getPitch() * Math.PI / 180) * dist), blockPos.z + (Math.cos(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180) * dist));
            }
            if (World.getBlock(blockPos).id != 0) {
                World.setBlock(blockPos, 0);
                console.log("mined block!!");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    place() {
        let blockPos = new Vector(this.pos.x, this.pos.y + 1, this.pos.z);
        let i = 0;
        let dist = 0.1;
        try {
            let lastPos = new Vector(0, 0, 0);
            while (World.getBlock(blockPos).id == 0 && i < 5) {
                //    console.log(Main.chunks[chunkPos.x][chunkPos.z].getBlock(inChunkPos));
                //  console.log(blockPos);
                lastPos = blockPos.copy();
                i += dist;
                blockPos = new Vector(blockPos.x + (Math.sin(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180) * dist), blockPos.y + (Math.sin(this.camera.getPitch() * Math.PI / 180) * dist), blockPos.z + (Math.cos(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180) * dist));
            }
            if (World.getBlock(lastPos).id == 0 && i < 5) {
                World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                CanvaManager.mouse.right = false;
                console.log("placed block!! at: ", lastPos);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    placeBlock() {
        let secondPos = this.pos.copy();
        secondPos.y = secondPos.y + 1;
        let firstPos = new Vector(secondPos.x + (Math.sin(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180) * 5), secondPos.y + (Math.sin(this.camera.getPitch() * Math.PI / 180) * 5), secondPos.z + (5 * Math.cos(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180)));
        let temp = secondPos;
        secondPos = firstPos;
        firstPos = temp;
        let ndVec = new Vector(firstPos.x - secondPos.x, firstPos.y - secondPos.y, firstPos.z - secondPos.z);
        let dVec = new Vector(Math.abs(ndVec.x), Math.abs(ndVec.y), Math.abs(ndVec.z));
        if (dVec.x > dVec.y && dVec.x > dVec.z) {
            //driving x axis
            let py = (2 * dVec.y) - dVec.x;
            let pz = (2 * dVec.z) - dVec.x;
            let i = dVec.x - 1;
            let dod = new Vector(1, 1, 1);
            while (i > 0) {
                i--;
                if (firstPos.x < secondPos.x)
                    dod.x = 1;
                else
                    dod.x = -1;
                if (firstPos.y < secondPos.y)
                    dod.y = 1;
                else
                    dod.y = -1;
                if (firstPos.z < secondPos.z)
                    dod.z = 1;
                else
                    dod.z = -1;
                let lastPos = firstPos;
                if (py < 0 && pz < 0) {
                    firstPos = new Vector(firstPos.x + dod.x, firstPos.y, firstPos.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    py = py + (2 * dVec.y);
                    pz = pz + (2 * dVec.z);
                }
                else if (py > 0 && pz < 0) {
                    firstPos = new Vector(firstPos.x, firstPos.y + dod.y, firstPos.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    py = py + ((2 * dVec.y) - (2 * dVec.x));
                    pz = pz + (2 * dVec.z);
                }
                else if (py == 0) {
                    firstPos = new Vector(firstPos.x + dod.x, firstPos.y, firstPos.z + dod.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    py = py + (2 * dVec.y);
                    pz = pz + ((2 * dVec.z) - (2 * dVec.x));
                }
                else {
                    firstPos = new Vector(firstPos.x + dod.x, firstPos.y, firstPos.z + dod.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    py = py + ((2 * dVec.y) - (2 * dVec.x));
                    pz = pz + ((2 * dVec.z));
                }
            }
        }
        else if (dVec.y > dVec.x && dVec.y > dVec.z) {
            //driving y axis
            let px = (2 * dVec.x) - dVec.y;
            let pz = (2 * dVec.z) - dVec.y;
            let i = dVec.y - 1;
            let dod = new Vector(1, 1, 1);
            while (i > 0) {
                i--;
                let lastPos = firstPos;
                if (firstPos.x < secondPos.x)
                    dod.x = 1;
                else
                    dod.x = -1;
                if (firstPos.y < secondPos.y)
                    dod.y = 1;
                else
                    dod.y = -1;
                if (firstPos.z < secondPos.z)
                    dod.z = 1;
                else
                    dod.z = -1;
                if (px < 0 && pz < 0) {
                    firstPos = new Vector(firstPos.x, firstPos.y + dod.y, firstPos.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + (2 * dVec.x);
                    pz = pz + (2 * dVec.z);
                }
                else if (px > 0 && pz < 0) {
                    firstPos = new Vector(firstPos.x + dod.x, firstPos.y + dod.y, firstPos.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + ((2 * dVec.x) - (2 * dVec.y));
                    pz = pz + (2 * dVec.z);
                }
                else if (px == 0) {
                    firstPos = new Vector(firstPos.x, firstPos.y + dod.y, firstPos.z + dod.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + (2 * dVec.x);
                    pz = pz + ((2 * dVec.z) - (2 * dVec.y));
                }
                else {
                    firstPos = new Vector(firstPos.x + dod.x, firstPos.y + dod.y, firstPos.z + dod.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + ((2 * dVec.x) - (2 * dVec.y));
                    pz = pz + ((2 * dVec.z) - (2 * dVec.y));
                }
            }
        }
        else if (dVec.z > dVec.x && dVec.z > dVec.y) {
            //driving z axis
            let px = (2 * dVec.x) - dVec.z;
            let py = (2 * dVec.y) - dVec.z;
            let i = dVec.z - 1;
            let dod = new Vector(1, 1, 1);
            while (i > 0) {
                i--;
                if (firstPos.x < secondPos.x)
                    dod.x = 1;
                else
                    dod.x = -1;
                if (firstPos.y < secondPos.y)
                    dod.y = 1;
                else
                    dod.y = -1;
                if (firstPos.z < secondPos.z)
                    dod.z = 1;
                else
                    dod.z = -1;
                let lastPos = firstPos;
                if (px < 0 && py < 0) {
                    firstPos = new Vector(firstPos.x, firstPos.y, firstPos.z + dod.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + (2 * dVec.x);
                    py = py + (2 * dVec.y);
                }
                else if (px > 0 && py < 0) {
                    firstPos = new Vector(firstPos.x + dod.x, firstPos.y + dod.y, firstPos.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + ((2 * dVec.x) - (2 * dVec.z));
                    py = py + (2 * dVec.y);
                }
                else if (px == 0) {
                    firstPos = new Vector(firstPos.x, firstPos.y + dod.y, firstPos.z + dod.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + (2 * dVec.x);
                    py = py + ((2 * dVec.y) - (2 * dVec.z));
                }
                else {
                    firstPos = new Vector(firstPos.x + dod.x, firstPos.y + dod.y, firstPos.z + dod.z);
                    if (World.getBlock(firstPos).id != 0) {
                        World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                        CanvaManager.mouse.right = false;
                        return;
                    }
                    px = px + ((2 * dVec.x) - (2 * dVec.z));
                    py = py + ((2 * dVec.y) - (2 * dVec.z));
                }
            }
        }
    }
    placeBlock2() {
        let firstPos = this.pos.copy();
        firstPos.y = firstPos.y + 1;
        let secondPos = new Vector(firstPos.x + (Math.sin(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180) * 5), firstPos.y + (Math.sin(this.camera.getPitch() * Math.PI / 180) * 5), firstPos.z + (5 * Math.cos(this.camera.getYaw() * Math.PI / 180) * Math.cos(this.camera.getPitch() * Math.PI / 180)));
        secondPos = new Vector(Math.round(secondPos.x), Math.round(secondPos.y), Math.round(secondPos.z));
        let i = 0;
        let dod = new Vector(1, 1, 1);
        while (i < 5) {
            i++;
            let ndVec = new Vector(firstPos.x - secondPos.x, firstPos.y - secondPos.y, firstPos.z - secondPos.z);
            let dVec = new Vector(Math.abs(ndVec.x), Math.abs(ndVec.y), Math.abs(ndVec.z));
            if (firstPos.x < secondPos.x)
                dod.x = 1;
            else
                dod.x = -1;
            if (firstPos.y < secondPos.y)
                dod.y = 1;
            else
                dod.y = -1;
            if (firstPos.z < secondPos.z)
                dod.z = 1;
            else
                dod.z = -1;
            let lastPos = firstPos.copy();
            if (dVec.x >= dVec.y && dVec.x >= dVec.z) {
                firstPos.x += dod.x;
            }
            else if (dVec.y >= dVec.x && dVec.y >= dVec.z) {
                firstPos.y += dod.y;
            }
            else if (dVec.z >= dVec.x && dVec.z >= dVec.y) {
                firstPos.z += dod.z;
            }
            if (World.getBlock(firstPos).id != 0) {
                World.setBlock(lastPos, this.itemsBar[this.selectedItem]);
                CanvaManager.mouse.right = false;
                return;
            }
        }
    }
}
