import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Shader2d } from "./Engine/Shader/Shader2d.js";
import { Task } from "./Engine/Task.js";
import { Texture } from "./Engine/Texture.js";
import { Array3D } from "./Engine/Utils/Array3D.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
import { blocks } from "./Game/Block.js";
import { Chunk } from "./Game/Chunk.js";
import { GUI } from "./Game/GUI.js";
import { Player } from "./Game/Player.js";
import { World } from "./Game/World.js";
let gl = CanvaManager.gl;
export class Main {
    static dispLl = false;
    static fastBreaking = false;
    static FPS = 61;
    static fastTPS = 60;
    static TPS = 20;
    static sunLight = 14;
    static file = null;
    static entities = new Array();
    static Measure = {
        tps: 0,
        fps: 0,
        lastTime: 0,
        ticks: 0,
        frames: 0
    };
    static shader2d;
    static tasks = new Array(11);
    static lastTick = 0;
    static lastFrame = 0;
    static shader;
    static delta = 0;
    static crossVAO;
    static fastDelta = 0;
    static lastFastTick = 0;
    static player = new Player(new Vector(0, 60, 0));
    static range = { start: 0, end: 1 };
    //public static chunks:Array<Array<Chunk>>=new Array(8);
    static loadedChunks = new Array();
    static crosscords = [
        -0.02, -0.02,
        0.02, 0.02,
        -0.02, 0.02,
        0.02, -0.02
    ];
    static crosstcords = [
        0, 0,
        9, 9,
        0, 9,
        9, 0
    ];
    static crossindices = [
        0, 1, 2, 3, 1, 0
    ];
    static run() {
        CanvaManager.setupCanva(document.body);
        // EBO.unbind();
        // VBO.unbind();
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        // gl.enable(gl.CULL_FACE);
        // gl.cullFace(gl.BACK);
        //Transparency requires blending 
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        //Shader for world
        this.shader = new DefaultShader();
        //shader for GUI(2d)
        this.shader2d = new Shader2d();
        //loading crosshair 
        GUI.init();
        this.crossVAO = new VAO();
        let vbo = new VBO();
        vbo.bufferData(this.crosscords);
        this.crossVAO.addPtr(0, 2, 0, 0);
        let vtc = new VBO();
        vtc.bufferData(this.crosstcords);
        this.crossVAO.addPtr(1, 2, 0, 0);
        let ebo = new EBO();
        ebo.bufferData(this.crossindices);
        VAO.unbind();
        VBO.unbind();
        EBO.unbind();
        //init world
        World.init();
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i] = new Array();
        }
        //loading chunks
        //  console.log(this.chunks);
        //   this.TESTtransf = this.TESTtransf.scale(2,1,1);
        requestAnimationFrame(this.loop.bind(this));
    }
    static addTask(task, priority) {
        this.tasks[priority].push(task);
    }
    static cancelTasks(caller, label) {
        for (let x = 0; x < this.tasks.length; x++)
            for (let y = this.tasks[x].length - 1; y > -1; y--)
                if (this.tasks[x][y].caller == caller && this.tasks[x][y].label == label)
                    this.tasks[x].splice(y, 1);
    }
    static loop(time) {
        if (this.Measure.lastTime <= time - 1000) {
            this.Measure.lastTime = time;
            this.Measure.tps = this.Measure.ticks;
            this.Measure.ticks = 0;
            this.Measure.fps = this.Measure.frames;
            this.Measure.frames = 0;
        }
        let delta = time - this.lastTick;
        this.delta += delta / (2000 / this.TPS);
        // console.log(this.delta);
        if (this.delta >= 1)
            this.lastTick = time;
        while (this.delta >= 1) {
            if (this.delta > 100) {
                console.log("Is game overloaded? Skipping " + delta + "ms");
                this.delta = 0;
            }
            this.delta--;
            this.update();
        }
        ;
        this.limitChunks();
        //60 updates
        let fastDelta = time - this.lastFastTick;
        this.fastDelta += fastDelta / (2000 / this.fastTPS);
        // console.log(this.fastDelta);
        if (this.fastDelta >= 1)
            this.lastFastTick = time;
        while (this.fastDelta >= 1) {
            if (this.fastDelta > 100) {
                console.log("Is game overloaded? Skipping " + fastDelta + "ms");
                this.fastDelta = 0;
            }
            this.fastDelta--;
            this.fastUpdate();
        }
        ;
        let testTime = Date.now();
        if (this.Measure.fps > 20)
            while (Date.now() - testTime < 20) {
                this.executeTasks(testTime);
                // this.chunksUpdate();
            }
        if (this.lastFrame < time - (1000 / this.FPS)) {
            this.render();
            this.lastFrame = time;
        }
        requestAnimationFrame(this.loop.bind(this));
    }
    static executeTasks(time) {
        for (let i = this.tasks.length - 1; i >= 0; i--) {
            while (this.tasks[i].length > 0) {
                let task = this.tasks[i].shift();
                task.func();
                if (Date.now() - time > 20)
                    return;
            }
        }
    }
    static fastUpdate() {
        this.player.update();
    }
    static update() {
        if (CanvaManager.getKey(52) && this.sunLight < 16)
            this.sunLight++;
        if (CanvaManager.getKey(53) && this.sunLight > 0)
            this.sunLight--;
        this.Measure.ticks++;
        // this.count++;
        // if(this.count>this.test.indices.length)
        //this.count=3;
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(i);
        }
        GUI.update();
        if (Math.floor(Math.random() * 50) == 1) {
            let rand = 0;
            //   this.test.subchunks[rand].blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
            // this.test.subchunks[rand].updateVerticesIndices();
            //  this.test.blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
            //this.test.updateVerticesIndices();
        }
        if (CanvaManager.getKeyOnce(54))
            this.exportChunks();
        if (CanvaManager.getKeyOnce(55))
            this.upload();
        if (this.file != null) {
            for (let x = 0; x < Main.tasks.length; x++)
                Main.tasks[x] = new Array();
            for (let x = 0; x < this.file.length - 1; x++) {
                let x2 = this.file[x].pos[0];
                let z2 = this.file[x].pos[1];
                if (x2 == undefined || z2 == undefined) {
                    continue;
                }
                let chunk = this.getChunkAt(x2, z2);
                if (chunk == undefined) {
                    chunk = new Chunk(x2, z2, true);
                    this.loadedChunks.push(chunk);
                }
                for (let k = 0; k < 16; k++) {
                    for (let l = 0; l < 16; l++) {
                        chunk.heightmap[k][l] = 0;
                    }
                }
                for (let a = 0; a < 16; a++) {
                    chunk.subchunks[a].genBlocks();
                    for (let x1 = 0; x1 < 16; x1++)
                        for (let y1 = 0; y1 < 16; y1++)
                            for (let z1 = 0; z1 < 16; z1++) {
                                if (this.file[x].blocks[x1][y1][z1] != NaN) {
                                    chunk.subchunks[a].blocks[x1][y1][z1].id = this.file[x].blocks[a][x1][y1][z1];
                                }
                                if (chunk.subchunks[a].blocks[x1][y1][z1].id > 0 && y1 + (chunk.subchunks[a].pos.y * 16) > chunk.heightmap[x1][z1])
                                    chunk.heightmap[x1][z1] = y1 + (chunk.subchunks[a].pos.y * 16);
                            }
                    Main.addTask(new Task(() => {
                        chunk.subchunks[a].inReGeneration = false;
                        chunk.subchunks[a].update(9);
                    }, Main), 9);
                    // console.log( this.chunks[x2][z2].subchunks[a]);
                }
                chunk.lazy = false;
            }
            if (!(this.file[this.file.length - 1] instanceof Array) && this.file[this.file.length - 1].pPos != undefined) {
                let k = this.file[this.file.length - 1].pPos;
                console.log(k);
                this.player.pos = new Vector(k[0], k[1], k[2]);
            }
            console.log("Loaded");
            this.file = null;
        }
        //  this.TESTtransf =  this.TESTtransf.rotateZ(1);
        //this.TESTtransf =  this.TESTtransf.rotateY(1);
    }
    static limitChunks() {
        let x = Math.floor(Math.round(this.player.pos.x) / 16);
        let z = Math.floor(Math.round(this.player.pos.z) / 16);
        let chunk = this.getORnew(x, z, false);
        let step = 1;
        let iter = 1;
        let howMuch = 100;
        let loadBuffer = new Array();
        loadBuffer.push(chunk);
        if (chunk.lazy)
            chunk.updateAllSubchunks(2);
        let nextCoords = new Vector(x, 0, z);
        //Spiral chunk loading algorithm
        let lazyChunkPhase = false;
        let k = 0;
        while (k < 2) {
            if (lazyChunkPhase)
                k++;
            if (loadBuffer.length >= howMuch)
                lazyChunkPhase = true;
            //x
            for (let i = 0; i < iter; i++) {
                nextCoords.x += step;
                let chunk = this.getORnew(nextCoords.x, nextCoords.z, lazyChunkPhase);
                if (!lazyChunkPhase && chunk.lazy)
                    chunk.updateAllSubchunks(2);
                loadBuffer.push(chunk);
                if (loadBuffer.length >= howMuch)
                    lazyChunkPhase = true;
            }
            //z
            for (let i = 0; i < iter; i++) {
                nextCoords.z += step;
                let chunk = this.getORnew(nextCoords.x, nextCoords.z, lazyChunkPhase);
                if (!lazyChunkPhase && chunk.lazy)
                    chunk.updateAllSubchunks(2);
                loadBuffer.push(chunk);
                if (loadBuffer.length >= howMuch)
                    lazyChunkPhase = true;
            }
            //increase and invert step
            iter++;
            step = -step;
        }
        this.loadedChunks = loadBuffer;
    }
    static getORnew(x, z, lazy) {
        return this.getChunkAt(x, z) ?? new Chunk(x, z, lazy);
    }
    static exportChunks() {
        let k = new Array();
        for (let x = 0; x < this.loadedChunks.length; x++) {
            let chunk = this.loadedChunks[x];
            //  console.log(chunk);
            if (chunk == undefined)
                continue;
            let blocks = new Array(16);
            for (let a = 0; a < 16; a++) {
                if (chunk.subchunks[a] == undefined)
                    continue;
                let c = new Array3D(16, 16, 16);
                for (let x1 = 0; x1 < 16; x1++)
                    for (let y1 = 0; y1 < 16; y1++)
                        for (let z1 = 0; z1 < 16; z1++) {
                            if (chunk.subchunks[a].blocks[x1][y1][z1] == undefined || chunk.subchunks[a].blocks[x1][y1][z1] == null)
                                c[x1][y1][z1] = 0;
                            else
                                c[x1][y1][z1] = chunk.subchunks[a].blocks[x1][y1][z1].id;
                        }
                blocks[a] = c;
            }
            k.push({
                pos: [chunk.pos.x, chunk.pos.z],
                blocks: blocks
            });
        }
        k.push({ pPos: [this.player.pos.x, this.player.pos.y, this.player.pos.z] });
        this.download(JSON.stringify(k), "world.json", "text/plain");
    }
    static getChunkAt(x, z) {
        for (let i = 0; i < this.loadedChunks.length; i++)
            if (this.loadedChunks[i].pos.x == x && this.loadedChunks[i].pos.z == z)
                return this.loadedChunks[i];
        return undefined;
    }
    static download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    static upload() {
        var a = document.createElement("input");
        a.type = "file";
        a.click();
        a.oninput = (ev) => {
            let file = a.files.item(0);
            //console.log(file);
            const reader = new FileReader();
            let ok;
            reader.onload = (okok) => {
                ok = okok.target.result;
                this.file = JSON.parse(ok);
                console.log(this.file);
            };
            var text = reader.result;
            let k = reader.readAsText(file);
            console.log(ok);
            //JSON.parse(file);
        };
    }
    static render() {
        this.Measure.frames++;
        CanvaManager.debug.value = "Fps: " + this.Measure.fps + " Selected block: " + blocks[this.player.itemsBar[this.player.selectedItem].id].name + " Count:" + this.player.itemsBar[this.player.selectedItem].count;
        this.shader.use();
        this.player.camera.preRender();
        CanvaManager.preRender();
        gl.clearColor(0.0, this.sunLight / 15, this.sunLight / 15, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, Texture.blocksGridTest);
        let toRender = new Array();
        Main.shader.loadUniforms(Main.player.camera.getProjection(), Matrix.identity(), Main.player.camera.getView(), Main.sunLight);
        for (let chunk of this.loadedChunks) {
            if (!chunk.lazy) {
                chunk.render();
                toRender.push(() => { chunk.renderWater(); });
            }
        }
        while (toRender.length > 0) {
            toRender.shift()();
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render();
        }
        //render crosshair
        this.player.render();
        GUI.render(this.shader2d);
    }
    static test() {
        for (let x = this.range.start - 1; x < this.range.end + 1; x++)
            for (let z = this.range.start - 1; z < this.range.end + 1; z++) {
                let x2 = Math.floor(Math.round(this.player.pos.x) / 16) + x;
                let z2 = Math.floor(Math.round(this.player.pos.z) / 16) + z;
                let chunk = this.getChunkAt(x2, z2);
                if (chunk == undefined) {
                    chunk = new Chunk(x2, z2, true);
                    this.loadedChunks.push(chunk);
                }
                if (chunk.lazy && !(x == this.range.start - 1 || x == this.range.end + 1 || z == this.range.start - 1 || z == this.range.end + 1))
                    chunk.generate();
                chunk.render();
                //    toRender.push(()=>{chunk.renderWater()});
            }
    }
}
Main.run();
