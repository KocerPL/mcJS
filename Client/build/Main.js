import { CanvaManager } from "./Engine/CanvaManager.js";
import { AtlasShader } from "./Engine/Shader/AtlasShader.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Shader2d } from "./Engine/Shader/Shader2d.js";
import { MenuScene } from "./Game/scenes/MenuScene.js";
const gl = CanvaManager.gl;
export class Main {
    static scene;
    static FPS = 61;
    static shared = {};
    static fastTPS = 60;
    static Measure = {
        tps: 0,
        fps: 0,
        lastTime: 0,
        ticks: 0,
        frames: 0,
        lastLimit: 0
    };
    static shader2d;
    static lastTick = 0;
    static lastFrame = 0;
    static shader;
    static atlasShader;
    static delta = 0;
    static run() {
        this.shader = new DefaultShader();
        this.atlasShader = new AtlasShader();
        //shader for GUI(2d)
        this.shader2d = new Shader2d();
        this.scene = new MenuScene();
        CanvaManager.setupCanva(document.body);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        //Transparency requires blending 
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.scene.start();
        //init world
        //loading chunks
        requestAnimationFrame(this.loop.bind(this));
    }
    static changeScene(scene) {
        delete this.scene;
        this.scene = scene;
        this.scene.start();
    }
    ////MAIN LOOP\\\\
    static loop(time) {
        if (this.Measure.lastTime <= time - 1000)
            this.resetMeasure(time);
        const delta = time - this.lastTick;
        this.delta += delta / (2000 / this.scene.TPS);
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
        this.render();
        this.lastFrame = time;
        requestAnimationFrame(this.loop.bind(this));
    }
    static resetMeasure(time) {
        this.Measure.lastTime = time;
        this.Measure.tps = this.Measure.ticks;
        this.Measure.ticks = 0;
        this.Measure.fps = this.Measure.frames;
        this.Measure.frames = 0;
    }
    static update() {
        this.scene.update();
    }
    static renderDebug() {
        //  CanvaManager.debug.innerText = "Fps: "+this.Measure.fps+" Selected block: "+ blocks[this.player.itemsBar[this.player.selectedItem].id].name +" Count:"+this.player.itemsBar[this.player.selectedItem].count+
        //"\n XYZ:  X:"+(Math.floor(this.player.pos.x*100)/100)+"  Y:"+(Math.floor(this.player.pos.y*100)/100)+"  Z:"+(Math.floor(this.player.pos.z*100)/100)+"\nFast break [8]: "+this.fastBreaking+" Fly[9]: "+this.fly+"\n Sky light [4][5]:"+this.sunLight
        //+"\n Visible chunks[6][7]: "+this.maxChunks+"\n    Heightmap:"+World.getHeightMap(this.player.pos);
    }
    static render() {
        this.Measure.frames++;
        this.renderDebug();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.scene.render();
    }
}
Main.run();
