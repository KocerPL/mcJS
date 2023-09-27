import { Vector } from "./Engine/Utils/Vector.js";
import { Block, blockType } from "./Game/Block.js";
import { World } from "./Game/World.js";
class LightNode {
    x;
    y;
    z;
    light;
    constructor(x, y, z, light) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.light = light;
    }
    toVector() {
        return new Vector(this.x, this.y, this.z);
    }
}
function hasNode(x, y, z, list) {
    for (const l of list) {
        if (l.x == x && l.y == y && l.z == z)
            return true;
    }
    return false;
}
export class Lighter {
    static light(x, y, z, light, gs) {
        const list = [];
        let firstNode = true;
        list.push(new LightNode(x, y, z, light));
        for (let i = 0; list.length > i; i++) {
            const curLightNode = list[i];
            if (curLightNode.light <= 0)
                continue;
            x = curLightNode.x;
            z = curLightNode.z;
            y = curLightNode.y;
            light = curLightNode.light;
            const d = World.getBlockAndSub(new Vector(x, y, z), gs);
            gs.toUpdate.add(d.sub);
            if (!firstNode && Block.info[d.block.id].type == blockType.FULL)
                continue;
            firstNode = false;
            d.block.lightFBlock = curLightNode.light;
            let test = World.getBlock(new Vector(x + 1, y, z), gs);
            if (test && test.lightFBlock + 1 < curLightNode.light && !hasNode(x + 1, y, z, list)) {
                list.push(new LightNode(x + 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x - 1, y, z), gs);
            if (test && test.lightFBlock + 1 < curLightNode.light && !hasNode(x - 1, y, z, list)) {
                list.push(new LightNode(x - 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y + 1, z), gs);
            if (test && test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y + 1, z, list)) {
                list.push(new LightNode(x, y + 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y - 1, z), gs);
            if (test && test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y - 1, z, list)) {
                list.push(new LightNode(x, y - 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z + 1), gs);
            if (test && test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y, z + 1, list)) {
                list.push(new LightNode(x, y, z + 1, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z - 1), gs);
            if (test && test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y, z - 1, list)) {
                list.push(new LightNode(x, y, z - 1, light - 1));
            }
        }
    }
    static removeLight(x, y, z, light, gs) {
        const list = [];
        let firstNode = true;
        list.push(new LightNode(x, y, z, light + 2));
        for (let i = 0; list.length > i; i++) {
            const curLightNode = list[i];
            if (curLightNode.light <= 0)
                continue;
            x = curLightNode.x;
            z = curLightNode.z;
            y = curLightNode.y;
            light = curLightNode.light;
            const d = World.getBlockAndSub(new Vector(x, y, z), gs);
            gs.toUpdate.add(d.sub);
            if (!firstNode && d.block.id > 0)
                continue;
            firstNode = false;
            d.block.lightFBlock = 0;
            let test = World.getBlock(new Vector(x + 1, y, z), gs);
            if (test.lightFBlock + 1 < curLightNode.light && !hasNode(x + 1, y, z, list)) {
                list.push(new LightNode(x + 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x - 1, y, z), gs);
            if (test.lightFBlock + 1 < curLightNode.light && !hasNode(x - 1, y, z, list)) {
                list.push(new LightNode(x - 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y + 1, z), gs);
            if (test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y + 1, z, list)) {
                list.push(new LightNode(x, y + 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y - 1, z), gs);
            if (test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y - 1, z, list)) {
                list.push(new LightNode(x, y - 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z + 1), gs);
            if (test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y, z + 1, list)) {
                list.push(new LightNode(x, y, z + 1, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z - 1), gs);
            if (test.lightFBlock + 1 < curLightNode.light && !hasNode(x, y, z - 1, list)) {
                list.push(new LightNode(x, y, z - 1, light - 1));
            }
        }
        for (let i = list.length - 1; i >= 0; i--) {
            if (World.getBlock(list[i].toVector(), gs).id <= 0)
                this.processOneBlockLight(list[i].x, list[i].y, list[i].z, gs);
        }
    }
    static processOneBlockLight(x, y, z, gs) {
        let light = 0;
        let test = World.getBlock(new Vector(x + 1, y, z), gs);
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x - 1, y, z), gs);
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y + 1, z), gs);
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y - 1, z), gs);
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y + 1, z), gs);
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y, z - 1), gs);
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y, z + 1), gs);
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        this.light(x, y, z, light, gs);
    }
}
