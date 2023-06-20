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
}
function hasNode(x, y, z, list) {
    for (const l of list) {
        if (l.x == x && l.y == y && l.z == z)
            return true;
    }
    return false;
}
export class Lighter {
    static light(x, y, z, light) {
        console.log("start light");
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
            console.log("Lighting!!", x, ",", y, ",", z);
            if (!firstNode && World.getBlock(new Vector(x, y, z)).id > 0)
                continue;
            firstNode = false;
            const d = World.getBlockAndSub(new Vector(x, y, z));
            d.block.lightFBlock = curLightNode.light;
            Main.toUpdate.add(d.sub);
            let test = World.getBlock(new Vector(x + 1, y, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x + 1, y, z, list)) {
                // console.log("push!!!")
                list.push(new LightNode(x + 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x - 1, y, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x - 1, y, z, list)) {
                //console.log("push!!!")
                list.push(new LightNode(x - 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y + 1, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y + 1, z, list)) {
                //  console.log("push!!!")
                list.push(new LightNode(x, y + 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y - 1, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y - 1, z, list)) {
                //console.log("push!!!")
                list.push(new LightNode(x, y - 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z + 1));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y, z + 1, list)) {
                ////console.log("push!!!")
                list.push(new LightNode(x, y, z + 1, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z - 1));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y, z - 1, list)) {
                // console.log("push!!!")
                list.push(new LightNode(x, y, z - 1, light - 1));
            }
        }
        console.log("stop light");
    }
    static removeLight(x, y, z, light) {
        console.log("start light");
        const list = [];
        let firstNode = true;
        list.push(new LightNode(x, y, z, light + 2));
        const toRelight = [];
        for (let i = 0; list.length > i; i++) {
            const curLightNode = list[i];
            if (curLightNode.light <= 0)
                continue;
            x = curLightNode.x;
            z = curLightNode.z;
            y = curLightNode.y;
            light = curLightNode.light;
            console.log("Lighting!!", x, ",", y, ",", z);
            if (!firstNode && World.getBlock(new Vector(x, y, z)).id > 0)
                continue;
            firstNode = false;
            const d = World.getBlockAndSub(new Vector(x, y, z));
            toRelight.push(new Vector(x, y, z));
            d.block.lightFBlock = 0;
            Main.toUpdate.add(d.sub);
            let test = World.getBlock(new Vector(x + 1, y, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x + 1, y, z, list)) {
                // console.log("push!!!")
                list.push(new LightNode(x + 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x - 1, y, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x - 1, y, z, list)) {
                //console.log("push!!!")
                list.push(new LightNode(x - 1, y, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y + 1, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y + 1, z, list)) {
                //  console.log("push!!!")
                list.push(new LightNode(x, y + 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y - 1, z));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y - 1, z, list)) {
                //console.log("push!!!")
                list.push(new LightNode(x, y - 1, z, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z + 1));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y, z + 1, list)) {
                ////console.log("push!!!")
                list.push(new LightNode(x, y, z + 1, light - 1));
            }
            test = World.getBlock(new Vector(x, y, z - 1));
            if (test.lightFBlock + 2 < curLightNode.light && !hasNode(x, y, z - 1, list)) {
                // console.log("push!!!")
                list.push(new LightNode(x, y, z - 1, light - 1));
            }
        }
        for (let i = 0; toRelight.length > i; i++) {
            if (World.getBlock(toRelight[i]).id <= 0)
                this.processOneBlockLight(toRelight[i].x, toRelight[i].y, toRelight[i].z);
        }
        console.log("stop light");
    }
    static processOneBlockLight(x, y, z) {
        let light = 0;
        let test = World.getBlock(new Vector(x + 1, y, z));
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x - 1, y, z));
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y + 1, z));
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y - 1, z));
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y + 1, z));
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y, z - 1));
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        test = World.getBlock(new Vector(x, y, z + 1));
        if (test.lightFBlock > light + 1)
            light = test.lightFBlock - 1;
        this.light(x, y, z, light);
    }
}
