import { CanvaManager } from "./Engine/CanvaManager.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Texture } from "./Engine/Texture.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { Chunk } from "./Game/Chunk.js";
import { Player } from "./Game/Player.js";
let gl = CanvaManager.gl;
export class Main {
    static FPS = 61;
    static TPS = 20;
    static Measure = {
        tps: 0,
        fps: 0,
        lastTime: 0,
        ticks: 0,
        frames: 0
    };
    static lastTick = 0;
    static lastFrame = 0;
    static shader;
    static delta = 0;
    static player = new Player(new Vector(0, 250, 0));
    static chunks = new Array(8);
    static test;
    static test2;
    static run() {
        CanvaManager.setupCanva(document.body);
        // EBO.unbind();
        // VBO.unbind();
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        this.shader = new DefaultShader();
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.activeTexture(gl.TEXTURE0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        Texture.blocksGrid.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Texture.blocksGrid);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            console.log("okok");
        };
        if (Texture.blocksGrid.complete) {
            Texture.blocksGrid.onload(new Event("loaded"));
        }
        for (let x = 0; x < 8; x++) {
            this.chunks[x] = new Array(16);
            for (let z = 0; z < 8; z++) {
                this.chunks[x][z] = new Chunk(x, z);
            }
        }
        this.test = new Chunk(0, 0);
        this.test2 = new Chunk(1, 0);
        //   this.TESTtransf = this.TESTtransf.scale(2,1,1);
        requestAnimationFrame(this.loop.bind(this));
    }
    static loop(time) {
        if (this.Measure.lastTime <= time - 1000) {
            this.Measure.lastTime = time;
            this.Measure.tps = this.Measure.ticks;
            this.Measure.ticks = 0;
            this.Measure.fps = this.Measure.frames;
            this.Measure.frames = 0;
            CanvaManager.debug.value = "Fps: " + this.Measure.fps + " Tps:" + this.Measure.tps;
            CanvaManager.debug.value += "Pos: x:" + this.player.pos.x + " y:" + this.player.pos.y + " z:" + this.player.pos.z;
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
        let testTime = Date.now();
        if (this.Measure.fps > 30)
            while (Date.now() - testTime < 20) {
                this.chunksUpdate();
            }
        if (this.lastFrame < time - (1000 / this.FPS)) {
            this.render();
            this.lastFrame = time;
        }
        requestAnimationFrame(this.loop.bind(this));
    }
    static chunksUpdate() {
        let time = Date.now();
        for (let x = 0; x < 8; x++)
            for (let z = 0; z < 8; z++) {
                this.chunks[x][z].update(time);
            }
    }
    static update() {
        this.Measure.ticks++;
        // this.count++;
        // if(this.count>this.test.indices.length)
        //this.count=3;
        if (Math.floor(Math.random() * 50) == 1) {
            let rand = 0;
            //   this.test.subchunks[rand].blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
            // this.test.subchunks[rand].updateVerticesIndices();
            //  this.test.blocks[Math.floor(Math.random()*16)][Math.floor(Math.random()*16)][Math.floor(Math.random()*16)] =Math.ceil(Math.random()*2);
            //this.test.updateVerticesIndices();
        }
        //  this.TESTtransf =  this.TESTtransf.rotateZ(1);
        //this.TESTtransf =  this.TESTtransf.rotateY(1);
    }
    static render() {
        this.Measure.frames++;
        this.player.camera.preRender();
        this.player.updatePos();
        CanvaManager.preRender();
        gl.clearColor(0.0, 0.0, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let x = 0; x < 8; x++)
            for (let z = 0; z < 8; z++) {
                this.chunks[x][z].render();
            }
    }
}
Main.run();
