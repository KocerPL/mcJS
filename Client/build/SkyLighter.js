import { Vector } from "./Engine/Utils/Vector.js";
import { World } from "./Game/World.js";
import { Main } from "./Main.js";
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
export class SkyLighter {
    static light(x, y, z, light) {
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
            if (!firstNode && World.getBlock(new Vector(x, y, z)).id > 0)
                continue;
            firstNode = false;
            const d = World.getBlockAndSub(new Vector(x, y, z));
            d.block.skyLight = curLightNode.light;
            Main.toUpdate.add(d.sub);
            let test = World.getBlock(new Vector(x + 1, y, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x + 1, y, z, list)) {
                list.push(new LightNode(x + 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x - 1, y, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x - 1, y, z, list)) {
                list.push(new LightNode(x - 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y + 1, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y + 1, z, list)) {
                list.push(new LightNode(x, y + 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y - 1, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y - 1, z, list)) {
                list.push(new LightNode(x, y - 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z + 1));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y, z + 1, list)) {
                list.push(new LightNode(x, y, z + 1, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z - 1));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y, z - 1, list)) {
                list.push(new LightNode(x, y, z - 1, light - 1));
            }
        }
    }
    static removeLight(x, y, z, light) {
        const list = [];
        let firstNode = true;
        list.push(new LightNode(x, y, z, light + 1));
        for (let i = 0; list.length > i; i++) {
            const curLightNode = list[i];
            if (curLightNode.light <= 0)
                continue;
            x = curLightNode.x;
            z = curLightNode.z;
            y = curLightNode.y;
            light = curLightNode.light;
            if (!firstNode && World.getBlock(new Vector(x, y, z)).id > 0)
                continue;
            firstNode = false;
            const d = World.getBlockAndSub(new Vector(x, y, z));
            d.block.skyLight = 0;
            Main.toUpdate.add(d.sub);
            let test = World.getBlock(new Vector(x + 1, y, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x + 1, y, z, list)) {
                list.push(new LightNode(x + 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x - 1, y, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x - 1, y, z, list)) {
                list.push(new LightNode(x - 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y + 1, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y + 1, z, list)) {
                list.push(new LightNode(x, y + 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y - 1, z));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y - 1, z, list)) {
                list.push(new LightNode(x, y - 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z + 1));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y, z + 1, list)) {
                list.push(new LightNode(x, y, z + 1, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z - 1));
            if (test && test.skyLight + 1 < curLightNode.light && !hasNode(x, y, z - 1, list)) {
                list.push(new LightNode(x, y, z - 1, light - 1));
            }
        }
        for (let i = list.length - 1; i >= 0; i--) {
            if (World.getBlock(list[i].toVector()).id <= 0)
                this.processOneBlockLight(list[i].x, list[i].y, list[i].z);
        }
    }
    static processOneBlockLight(x, y, z) {
        let light = 0;
        let test = World.getBlock(new Vector(x + 1, y, z));
        if (test && test.skyLight > light + 1)
            light = test.skyLight - 1;
        test = World.getBlock(new Vector(x - 1, y, z));
        if (test && test.skyLight > light + 1)
            light = test.skyLight - 1;
        test = World.getBlock(new Vector(x, y + 1, z));
        if (test && test.skyLight > light + 1)
            light = test.skyLight - 1;
        test = World.getBlock(new Vector(x, y - 1, z));
        if (test && test.skyLight > light + 1)
            light = test.skyLight - 1;
        test = World.getBlock(new Vector(x, y + 1, z));
        if (test && test.skyLight > light + 1)
            light = test.skyLight - 1;
        test = World.getBlock(new Vector(x, y, z - 1));
        if (test && test.skyLight > light + 1)
            light = test.skyLight - 1;
        test = World.getBlock(new Vector(x, y, z + 1));
        if (test && test.skyLight > light + 1)
            light = test.skyLight - 1;
        this.light(x, y, z, light);
    }
}
