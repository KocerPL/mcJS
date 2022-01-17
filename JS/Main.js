import { Camera } from "./Engine/Camera.js";
import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
import { SubChunk } from "./Game/SubChunk.js";
let gl = CanvaManager.gl;
class Main {
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
    static TESTtransf = Matrix.identity();
    static delta = 0;
    static camera = new Camera();
    static test = new SubChunk();
    static count = 3;
    static run() {
        CanvaManager.setupCanva(document.body);
        let vertices = [
            //przód
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
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            //góra
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5
        ];
        let indices = [
            2, 1, 0, 3, 0, 2,
            6, 5, 4, 7, 4, 6,
            10, 9, 8, 11, 8, 10,
            14, 13, 12, 15, 12, 14,
            18, 17, 16, 19, 16, 18,
            22, 21, 20, 23, 20, 22
        ];
        let colors = [
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 0.1, 1.0,
            0.0, 0.1, 1.0,
            0.0, 0.1, 1.0,
            0.0, 0.1, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0
        ];
        let test = this.test;
        let vao = new VAO();
        vao.bind();
        let vbo = new VBO();
        vbo.bufferData(test.vertices);
        vao.addPtr(0, 3, 0, 0);
        //let vco = new VBO();
        //vco.bufferData(colors);
        //  vao.addPtr(1,3,0,0);
        let ebo = new EBO();
        ebo.bufferData(test.indices);
        // EBO.unbind();
        // VBO.unbind();
        gl.enable(gl.DEPTH_TEST);
        this.shader = new DefaultShader();
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
        }
        let delta = time - this.lastTick;
        this.delta += delta / (2000 / this.TPS);
        // console.log(this.delta);
        if (this.delta >= 1)
            this.lastTick = time;
        while (this.delta >= 1) {
            this.delta--;
            this.update();
        }
        ;
        if (this.lastFrame < time - (1000 / this.FPS)) {
            this.render();
            this.lastFrame = time;
        }
        requestAnimationFrame(this.loop.bind(this));
    }
    static update() {
        this.Measure.ticks++;
        this.count++;
        if (this.count > this.test.indices.length)
            this.count = 3;
        //  this.TESTtransf =  this.TESTtransf.rotateZ(1);
        //this.TESTtransf =  this.TESTtransf.rotateY(1);
    }
    static render() {
        this.Measure.frames++;
        this.camera.preRender();
        CanvaManager.preRender();
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.shader.loadUniforms(this.camera.getProjection(), this.TESTtransf, this.camera.getView());
        gl.drawElements(gl.TRIANGLES, this.test.indices.length, gl.UNSIGNED_INT, 0);
    }
}
Main.run();
