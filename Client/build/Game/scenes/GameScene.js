import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Scene } from "../../Engine/Scene.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix4 } from "../../Engine/Utils/Matrix4.js";
import { Vector } from "../../Engine/Utils/Vector.js";
import { Main } from "../../Main.js";
import { Block } from "../Block.js";
import { Chunk } from "../Chunk.js";
import { Player } from "../Player.js";
import { SubChunk } from "../SubChunk.js";
import { World } from "../World.js";
import { PlayerEntity } from "../entities/PlayerEntity.js";
import { GUI } from "../gui/GUI.js";
import { Cross } from "../gui/Cross.js";
import { ItemBar } from "../gui/ItemBar.js";
import { Inventory } from "../gui/Inventory.js";
import { TextComponent } from "../gui/TextComponent.js";
import { ALIGN } from "../../Engine/Utils/TextSprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { ItemHolder } from "../gui/ItemHolder.js";
import { DarkScreen } from "../gui/DarkScreen.js";
import { Button } from "../gui/Button.js";
import { MenuScene } from "./MenuScene.js";
import { Item } from "../entities/Item.js";
const gl = CanvaManager.gl;
export class GameScene extends Scene {
    onKey(key) { }
    maxChunks = 10;
    maxSubUpdates = 1;
    okok = false;
    dispLl = false;
    fly = false;
    fastBreaking = false;
    renderGUI = true;
    // public static minimalStorage = [];
    sunLight = 14;
    entities = [];
    //private static unloadedChunks:Array<Chunk> = [];
    tasks = new Array(11);
    //private static lastTick = 0;
    //private static lastFrame=0;
    socket = io();
    //private static delta = 0;
    //private static fastDelta=0;
    //private static lastFastTick=0;
    cross;
    player;
    range = { start: 0, end: 1 };
    //public static chunks:Array<Array<Chunk>>=new Array(8);
    chunkQueue = [];
    loadedChunks = new Map();
    toUpdate = new Set();
    integratedServer;
    logged = false;
    counter = 0;
    fromSlot = 0;
    isInv = false;
    updateSubchunk() {
        //const concatQ:Set<Chunk> = new Set();
        const entry = this.toUpdate.entries().next().value;
        //console.log("running...",entry);
        //    console.log(entry[0].pos);
        if (entry) {
            this.toUpdate.delete(entry[0]);
            entry[0].update(this).then(() => {
                // console.log("updating...");
                entry[0].chunk.updateMesh();
                //   occasionalSleeper().then(()=>{
                //     this.updateSubchunk();
                // });
                setTimeout(() => { this.updateSubchunk(); }, 0);
            }).catch(() => {
                setTimeout(() => { this.updateSubchunk(); }, 0);
            });
        }
        else
            setTimeout(() => { this.updateSubchunk(); }, 100);
        //  concatQ.add(entry[0].chunk);
        // concatQ.forEach((chunk) =>{chunk.updateMesh();});
    }
    handleSubchunk(ev) {
        console.log("received subchunk");
        let chunk = this.getChunkAt(ev.data.subX, ev.data.subZ);
        if (chunk == undefined) {
            chunk = new Chunk(ev.data.subX, ev.data.subZ);
            this.loadedChunks.set(chunk.pos.x + "-" + chunk.pos.z, chunk);
        }
        //    console.log(ev.data);
        chunk.subchunks[ev.data.subY] = new SubChunk(new Vector(ev.data.subX, ev.data.subY, ev.data.subZ), chunk);
        for (let x = 0; x < 16; x++)
            for (let y = 0; y < 16; y++)
                for (let z = 0; z < 16; z++) {
                    chunk.subchunks[ev.data.subY].blocks[x][y][z] = new Block(ev.data.blocks[x + (y * 16) + (z * 256)]);
                    chunk.subchunks[ev.data.subY].blocks[x][y][z].skyLight = 0;
                }
        for (let i = 0; i < 16; i++)
            if (!chunk.subchunks[i])
                return;
        this.chunkQueue.push(this.getChunkAt(ev.data.subX, ev.data.subZ));
        //  console.log("Chunk at: x:"+ ev.data.subX+" z:"+ev.data.subZ+"is ready to be loaded");
    }
    start() {
        Block.createInfoArray();
        this.gui = new GUI(Main.shader2d);
        this.gui.add(new DarkScreen("DarkScreen"));
        this.cross = new Cross("Cross");
        CanvaManager.rPointer = true;
        this.gui.add(this.cross);
        this.gui.add(new ItemBar("ItemBar"));
        this.gui.add(new Inventory("Inventory"));
        this.gui.add(new TextComponent("debug", "FPS:", 0.01, null, ALIGN.left)).transformation = Matrix3.identity().translate(-1, 0.98);
        const ds = this.gui.add(new DarkScreen("ExitDarkScreen"));
        const butt = new Button("Exit game");
        ds.add(butt);
        butt.changeText("Exit game");
        butt.onclick = () => {
            this.socket.disconnect();
            delete this.socket;
            Main.changeScene(new MenuScene());
        };
        //  butt.changeText("Exit game");
        const mi = this.gui.add(new ItemHolder("mouse_item_holder", 0.02));
        for (let i = 1; i <= 9; i++) {
            const slot = this.gui.get("slot_" + i);
            slot.onclick = () => {
                const plSlot = this.player.itemsBar[i - 1];
                if (mi instanceof ItemHolder)
                    if (mi.blockID == 0) {
                        this.fromSlot = i - 1;
                        this.isInv = false;
                        mi.change(plSlot.id, plSlot.count);
                        this.player.updateItem(0, i - 1, 0);
                    }
                    else {
                        if (plSlot.id > 0) {
                            const blID = plSlot.id;
                            const count = plSlot.count;
                            this.socket.emit("moveItem", { slot1: i - 1, isInv1: false, slot2: this.fromSlot, isInv2: this.isInv });
                            //this.player.updateItem(mi.blockID,i-1,mi.count);
                            //mi.change(blID,count); 
                            mi.change(0, 0);
                        }
                        else {
                            this.socket.emit("moveItem", { slot1: i - 1, isInv1: false, slot2: this.fromSlot, isInv2: this.isInv });
                            //this.player.updateItem(mi.blockID,i-1,mi.count);
                            mi.change(0, 0);
                        }
                    }
                console.log("Clicked " + i + " slot");
            };
        }
        for (let i = 1; i <= 27; i++) {
            const slot = this.gui.get("invSlot_" + i);
            slot.onclick = () => {
                const plSlot = this.player.inventory[i - 1];
                if (mi instanceof ItemHolder)
                    if (mi.blockID == 0) {
                        this.fromSlot = i - 1;
                        this.isInv = true;
                        mi.change(plSlot.id, plSlot.count);
                        this.player.updateInvItem(0, i - 1, 0);
                    }
                    else {
                        if (plSlot.id > 0) {
                            const blID = plSlot.id;
                            const count = plSlot.count;
                            this.socket.emit("moveItem", { slot1: i - 1, isInv1: true, slot2: this.fromSlot, isInv2: this.isInv });
                            // this.player.updateInvItem(mi.blockID,i-1,mi.count);
                            // mi.change(blID,count);
                            mi.change(0, 0);
                        }
                        else {
                            this.socket.emit("moveItem", { slot1: i - 1, isInv1: true, slot2: this.fromSlot, isInv2: this.isInv });
                            // this.player.updateInvItem(mi.blockID,i-1,mi.count);
                            mi.change(0, 0);
                        }
                    }
                console.log("Clicked " + i + " slot");
            };
        }
        this.player = new Player(new Vector(-2, 144, -7), this);
        this.gui.get("Inventory").setVisible = this.player.openInventory;
        this.socket.emit("login", { nick: Main.shared.nick });
        this.socket.on("subchunk", this.handleSubchunk.bind(this));
        //socket.emit('addItem',{id:1,count:64,slot:0});
        this.socket.on("updateItem", (obj) => {
            if (obj.inventory)
                this.player.updateInvItem(obj.id, obj.slot, obj.count);
            else
                this.player.updateItem(obj.id, obj.slot, obj.count);
        });
        this.socket.on("updateEntity", (obj) => {
            for (const ent of this.entities)
                if (ent.UUID == obj.uuid) {
                    ent.pos = new Vector(obj.pos.x, obj.pos.y, obj.pos.z);
                }
        });
        this.socket.on("spawnPlayer", (pos, id) => {
            // console.log("summoningPLAYER");
            this.entities.push(new PlayerEntity(new Vector(pos.x, pos.y, pos.z), this, id));
        });
        this.socket.on("moveEntity", (id, pos, rot) => {
            const ent = this.getEntity(id);
            // ent.pos =new Vector(pos.x,pos.y,pos.z);
            if (ent instanceof PlayerEntity) {
                ent.setNextTransitions(new Vector(pos.x, pos.y, pos.z), new Vector(rot.x, rot.y, rot.z), 3);
            }
        });
        this.socket.on("login", (posStr, id) => {
            this.player.id = id;
            const pos = JSON.parse(posStr);
            this.player.pos = new Vector(pos.x, pos.y, pos.z);
            this.logged = true;
        });
        this.socket.io.on("reconnect", () => {
            location.reload();
        });
        this.socket.on("spawnEntity", (data) => {
            console.log("Spawn: " + data.uuid);
            console.log(data);
            if (data.type == "item")
                this.entities.push(new Item(Vector.fromData(data.pos), data.id, this, data.uuid));
        });
        this.socket.on("placeBlock", (data) => {
            if (data.id != 0)
                World.placeBlock(new Vector(data.pos.x, data.pos.y, data.pos.z), data.id, this);
            else
                World.breakBlock(new Vector(data.pos.x, data.pos.y, data.pos.z), this);
        });
        this.socket.on("killEntity", (uuid) => {
            console.log("KILL: " + uuid);
            for (let i = 0; i < this.entities.length; i++) {
                if (this.entities[i].UUID == uuid) {
                    this.entities.splice(i, 1);
                    break;
                }
            }
        });
        this.updateSubchunk();
    }
    onClick(x, y) {
        this.gui.onClick(x, y);
    }
    updateChunks() {
        const pPC = this.toChunkPos(this.player.pos);
        //   console.log(pPC);
        let i = 1;
        let step = 1;
        const time = Date.now();
        if (!this.loadedChunks.has(pPC.x + "-" + pPC.z)) {
            // console.log("LOADING: "+pPC.x+"  "+pPC.z);
            this.loadedChunks.set(pPC.x + "-" + pPC.z, new Chunk(pPC.x, pPC.z));
            for (let i = 15; i >= 0; i--)
                this.socket.emit("getSubchunk", pPC.x, i, pPC.z);
        }
        this.loadedChunks.get(pPC.x + "-" + pPC.z).lastUsed = time;
        while (i < this.maxChunks) {
            // console.log("LOADUNG: "+pPC.x+"  "+pPC.z);
            for (let j = 0; j < i; j++) {
                pPC.x += step;
                if (!this.loadedChunks.has(pPC.x + "-" + pPC.z)) {
                    // console.log("LOADING: "+pPC.x+"  "+pPC.z);
                    this.loadedChunks.set(pPC.x + "-" + pPC.z, new Chunk(pPC.x, pPC.z));
                    for (let i = 15; i >= 0; i--)
                        this.socket.emit("getSubchunk", pPC.x, i, pPC.z);
                }
                this.loadedChunks.get(pPC.x + "-" + pPC.z).lastUsed = time;
                //pPC.x+=step;
            }
            for (let j = 0; j < i; j++) {
                pPC.z += step;
                if (!this.loadedChunks.has(pPC.x + "-" + pPC.z)) {
                    //  console.log("LOADING: "+pPC.x+"  "+pPC.z);
                    this.loadedChunks.set(pPC.x + "-" + pPC.z, new Chunk(pPC.x, pPC.z));
                    for (let i = 15; i >= 0; i--)
                        this.socket.emit("getSubchunk", pPC.x, i, pPC.z);
                }
                this.loadedChunks.get(pPC.x + "-" + pPC.z).lastUsed = time;
            }
            step = -step;
            i++;
        }
        for (const data of this.loadedChunks) {
            if (data[1].lastUsed + 5000 < time) {
                delete data[1];
                this.loadedChunks.delete(data[0]);
            }
        }
    }
    update() {
        this.gui.get("mouse_item_holder").transformation = Matrix3.identity().translate(CanvaManager.mouse.pos.x, CanvaManager.mouse.pos.y);
        this.processChunks();
        //  this.updateSubchunks();
        if (this.logged)
            this.updateChunks();
        // if(CanvaManager.getKeyOnce("F2")) {this.cross.setVisible =!this.cross.getVisible;}
        if (CanvaManager.getKeyOnce("6"))
            console.log(World.getSubchunk(this.player.pos, this));
        if (CanvaManager.getKey("5") && this.sunLight < 16)
            this.sunLight++;
        if (CanvaManager.getKey("4") && this.sunLight > 0)
            this.sunLight--;
        if (CanvaManager.getKeyOnce("E")) {
            this.player.openInventory = !this.player.openInventory;
            this.gui.get("DarkScreen").setVisible = this.player.openInventory;
            this.gui.get("Inventory").setVisible = this.player.openInventory;
            CanvaManager.rPointer = !this.player.openInventory;
            const mi = this.gui.get("mouse_item_holder");
            if (mi instanceof ItemHolder)
                if (mi.blockID != 0) {
                    this.player.dropItem(mi.blockID, mi.count);
                    mi.change(0, 0);
                }
            if (!CanvaManager.rPointer)
                CanvaManager.unlockPointer();
        }
        if (CanvaManager.getKeyOnce("ESCAPE"))
            this.gui.get("ExitDarkScreen").setVisible = !this.gui.get("ExitDarkScreen").getVisible;
        // this.count++;
        // if(this.count>this.test.indices.length)
        //this.count=3;
        if (CanvaManager.getKeyOnce("]"))
            this.maxChunks--;
        if (CanvaManager.getKeyOnce("["))
            this.maxChunks++;
        if (CanvaManager.getKeyOnce("8"))
            this.fastBreaking = !this.fastBreaking;
        if (CanvaManager.getKeyOnce("9"))
            this.fly = !this.fly;
        if (CanvaManager.getKeyOnce("F2"))
            this.renderGUI = !this.renderGUI;
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(i);
        }
        this.player.update();
    }
    render() {
        this.counter++;
        if (this.counter > 10) {
            this.counter = 0;
            const txt = this.gui.get("debug");
            if (txt instanceof TextComponent)
                txt.changeText("FPS:" + Main.Measure.fps + " Position: X:" + this.player.pos.x + " Y:" + this.player.pos.y + " Z:" + this.player.pos.z);
        }
        Main.shader.use();
        this.player.camera.preRender();
        Main.shader.setFog(this.player.camera.getPosition(), (this.maxChunks - 1) * 16);
        CanvaManager.preRender();
        Texture.testAtkas.bind();
        Main.shader.loadUniforms(this.player.camera.getProjection(), Matrix4.identity(), this.player.camera.getView(), this.sunLight);
        for (const val of this.loadedChunks) {
            val[1].render();
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render();
        }
        this.player.render();
        if (this.renderGUI)
            this.gui.render();
        gl.clearColor(0.43 * (this.sunLight / 15), 0.69 * (this.sunLight / 15), (this.sunLight / 15), 1.0);
    }
    getEntity(id) {
        for (const entity of this.entities) {
            if (entity.UUID == id)
                return entity;
        }
    }
    getChunkAt(x, z) {
        const ch = this.loadedChunks.get(x + "-" + z);
        if (ch)
            return ch;
        return undefined;
    }
    processChunks() {
        for (let i = this.chunkQueue.length - 1; i >= 0; i--) {
            const chunk = this.chunkQueue[i];
            if (chunk.isSubArrayReady()) {
                chunk.prepareLight();
                chunk.sendNeighbours(this);
                this.chunkQueue.splice(i);
            }
            else {
                // console.log("preparing Chunk: ",chunk.pos);
                continue;
            }
        }
    }
    toChunkPos(vec) {
        return new Vector(Math.floor(Math.round(vec.x) / 16), 0, Math.floor(Math.round(vec.z) / 16));
    }
}
const occasionalSleeper = (function () {
    //
    let lastSleepingTime = performance.now();
    return function () {
        if (performance.now() - lastSleepingTime > 100) {
            lastSleepingTime = performance.now();
            return new Promise(resolve => setTimeout(resolve, 0));
        }
        else {
            return Promise.resolve();
        }
    };
}());
