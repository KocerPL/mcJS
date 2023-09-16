import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { Loader } from "./Engine/Loader.js";
import { AtlasShader } from "./Engine/Shader/AtlasShader.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Shader2d } from "./Engine/Shader/Shader2d.js";
import { Task } from "./Engine/Task.js";
import { Texture } from "./Engine/Texture.js";
import { Array3D } from "./Engine/Utils/Array3D.js";
import { Matrix4 } from "./Engine/Utils/Matrix4.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
import { Block, blocks } from "./Game/Block.js";
import { Chunk } from "./Game/Chunk.js";
import { Entity } from "./Game/Entity.js";
import { GUI } from "./Game/gui/GUI.js";
import { Player } from "./Game/Player.js";
import { SubChunk } from "./Game/SubChunk.js";
import { World } from "./Game/World.js";
import { PlayerEntity } from "./Game/entities/PlayerEntity.js";
import { Inventory } from "./Game/gui/Inventory.js";
import { ItemBar } from "./Game/gui/ItemBar.js";
const gl = CanvaManager.gl;
declare const io;
export class Main
{
    public static maxChunks =128;
    public static maxSubUpdates = 5;
    public static okok = false;
    public static dispLl = false;
    public static fly =false;
    public static fastBreaking=false;
    public static FPS=61;
    public static fastTPS=60;
    public static minimalStorage = [];
    public static TPS=20;
    public static sunLight=14;
    public static entities:Array<Entity> = [];
    public static gui:GUI;
    public static Measure = {
        tps:0,
        fps:0,
        lastTime:0,
        ticks:0,
        frames:0,
        lastLimit:0
    };
    private static unloadedChunks:Array<Chunk> = [];
    private static shader2d:Shader2d;
    public static tasks:Array<Array<Task>> = new Array(11);
    private static lastTick = 0;
    private static lastFrame=0;
    public static socket = io();
    public static shader:DefaultShader;
    public static atlasShader:AtlasShader;
    private static delta = 0;
    private static fastDelta=0;
    private static lastFastTick=0;
    public static inv:Inventory;
    public static player:Player ;
    public static range = {start:0, end:1};
    //public static chunks:Array<Array<Chunk>>=new Array(8);
    public static chunkQueue:Array<Chunk> = []; 
    public static loadedChunks:Array<Chunk> = [];
    public static toUpdate:Set<SubChunk> = new Set();
    public static integratedServer:Worker;
    public static heh():void
    {
        console.log("heh");
    }
    public static getEntity(id)
    {
        for(const entity of this.entities)
        {
            if(entity.ID == id)
                return entity;
        }
    }
    public static handleSubchunk(ev)
    {
        console.log("received subchunk");
        let chunk = Main.getChunkAt(ev.data.subX,ev.data.subZ);
        if(chunk==undefined)
        {
            chunk = new Chunk(ev.data.subX,ev.data.subZ);
            this.loadedChunks.push(chunk);
        }
        chunk.subchunks[ev.data.subY] = new SubChunk(new Vector(ev.data.subX,ev.data.subY,ev.data.subZ),chunk);
        for(let x=0;x<16;x++)    for(let y=0;y<16;y++)    for(let z=0;z<16;z++)
        {
            chunk.subchunks[ev.data.subY].blocks[x][y][z]=new Block(ev.data.blocks[x+(y*16)+(z*256)]);
            chunk.subchunks[ev.data.subY].blocks[x][y][z].skyLight=0;
        }
        for(let i=0;i<16;i++)
            if(!chunk.subchunks[i])
                return;
        this.chunkQueue.push(Main.getChunkAt(ev.data.subX,ev.data.subZ));
    }
    public static handleChunkReady(ev)
    {
        console.log("received chunk ready");
        this.chunkQueue.push(Main.getChunkAt(ev.data.chunkX,ev.data.chunkZ));
    }
    public static run():void
    {
        this.shader = new DefaultShader();
        this.atlasShader = new AtlasShader();
        console.log(this.atlasShader);
        //shader for GUI(2d)
        this.shader2d = new Shader2d();
        this.gui = new GUI(this.shader2d);
        this.inv = new Inventory("Inventory");
       
        this.gui.add(this.inv);
        this.gui.add(new ItemBar("ItemBar"));
        this.player = new Player(new Vector(-2,144,-7));
        this.socket.on("subchunk",(ev)=>{
             
            this.handleSubchunk(ev);
        });
        this.socket.on("spawnPlayer",(pos,id)=>{
            console.log("summoningPLAYER");
            this.entities.push(new PlayerEntity(new Vector(pos.x,pos.y,pos.z),id));
        });
        this.socket.on("moveEntity",(id,pos,rot)=>{
            const ent=  this.getEntity(id);
            // ent.pos =new Vector(pos.x,pos.y,pos.z);
            if(ent instanceof PlayerEntity)
            {
                ent.setNextTransitions(new Vector(pos.x,pos.y,pos.z),new Vector(rot.x,rot.y,rot.z),3);
               
            }
        });
        this.socket.on("login",(posStr:string,id)=>{
            this.player.id = id;
            const pos =JSON.parse(posStr);
            this.player.pos = new Vector(pos.x,pos.y,pos.z);
        });
        this.socket.io.on("reconnect",()=>{
            location.reload();
        });
        this.socket.on("placeBlock",(data)=>{
            if(data.id!=0)
                World.placeBlock(new Vector(data.pos.x,data.pos.y,data.pos.z),data.id);
            else
                World.breakBlock(new Vector(data.pos.x,data.pos.y,data.pos.z));
        });
        this.socket.on("killEntity",(id)=>{
            for(let i=0; i<this.entities.length;i++)
            {
                if(this.entities[i].ID ==id)
                {
                    this.entities.splice(i,1);
                    break;
                }
            }
        });
        for(let x=-4;x<4;x++)
            for(let z=-4;z<4;z++)
                for(let i=15;i>=0;i--)
                    this.socket.emit("getSubchunk",x,i,z);
   
        /* this.integratedServer = new Worker("./build/IntegratedServer/Main.js", {
            type: "module"
        });
        this.integratedServer.onmessage =(ev)=>{
            console.log("received Message");
            switch(ev.data.type)
            { 
            case "console":
                console.log(ev.data.msg);
                break;
            case "subchunk":
                this.handleSubchunk(ev);
                break;
            case "chunkReady":
                this.handleChunkReady(ev);
            
            }
        };
        this.integratedServer.postMessage("start");
        */
        CanvaManager.setupCanva(document.body);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        //gl.enable(gl.CULL_FACE);
        //gl.cullFace(gl.BACK);
        //Transparency requires blending 
        gl.enable (gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        //init world
        World.init();
        for(let i=0;i<this.tasks.length;i++)
        {
            this.tasks[i]=[];
        }
        //loading chunks
        requestAnimationFrame(this.loop.bind(this));
    
    }

    ////MAIN LOOP\\\\
    public static loop(time:number):void
    {
        if(this.chunkQueue.length>0)
            this.processChunk(this.chunkQueue.shift());
   
        if(this.Measure.lastTime <= time-1000)
            this.resetMeasure(time);
        const delta = time-this.lastTick;
        this.delta += delta/(2000/this.TPS);
        // console.log(this.delta);
        if(this.delta>=1) this.lastTick=time;
     
        while(this.delta>=1)
        {
            if(this.delta>100) {
                console.log("Is game overloaded? Skipping "+delta+"ms");
                this.delta = 0;
          
            }
            this.delta--;
            this.update();
        }
        //60 updates
        const fastDelta = time-this.lastFastTick;
        this.fastDelta += fastDelta/(2000/this.fastTPS);
        // console.log(this.fastDelta);
        if(this.fastDelta>=1) this.lastFastTick=time;
     
        while(this.fastDelta>=1)
        {
            if(this.fastDelta>100) {
                console.log("Is game overloaded? Skipping "+fastDelta+"ms");
                this.fastDelta = 0;
          
            }
            this.fastDelta--;
            this.fastUpdate();
        }
        this.updateSubchunks();
        this.render();
        this.lastFrame= time;
        requestAnimationFrame(this.loop.bind(this));
    }
    private static resetMeasure(time:number)
    {
        this.Measure.lastTime = time;
        this.Measure.tps = this.Measure.ticks;
        this.Measure.ticks=0;
        this.Measure.fps = this.Measure.frames;
        this.Measure.frames = 0;
    }
    private static updateSubchunks()
    {
        const concatQ:Set<Chunk> = new Set();
        let i=0;
        for(const entry of this.toUpdate.entries())
        {
            i++;
            if(i>this.maxSubUpdates) break;
            entry[0].update();
            concatQ.add(entry[0].chunk);
            this.toUpdate.delete(entry[0]);
        }
        concatQ.forEach((chunk) =>{chunk.updateMesh();});
    
    }
    public static processChunk(chunk:Chunk)
    {
        chunk.prepareLight();
        chunk.sendNeighbours();
    }
   
    private static fastUpdate()
    {
        for(let i=0;i<this.entities.length;i++)
        {
            this.entities[i].update(i);
        }
        this.player.update();
    }
    public static update()
    {
        if(CanvaManager.getKeyOnce(86)) {this.inv.setVisible =!this.inv.getVisible; console.log("VVVVV");}
        if(CanvaManager.getKeyOnce(71)) 
            console.log(World.getSubchunk(this.player.pos));
        if(CanvaManager.getKey(52)&&this.sunLight<16)
            this.sunLight++;
        if(CanvaManager.getKey(53)&&this.sunLight>0)
            this.sunLight--;  
        this.Measure.ticks++;
        // this.count++;
        // if(this.count>this.test.indices.length)
        //this.count=3;
      
        if(CanvaManager.getKeyOnce(54))
            this.maxChunks--;
        if(CanvaManager.getKeyOnce(55))
            this.maxChunks++;
        if(CanvaManager.getKeyOnce(56))
            this.fastBreaking=!this.fastBreaking;
        if(CanvaManager.getKeyOnce(57))
            this.fly=!this.fly;
    }
    public static minChunks()
    {
     
        const chunk  =this.unloadedChunks.splice(0,1)[0];
        if(chunk==undefined) return;
        console.log(this.unloadedChunks);
        const blocks = new Array(16);
        for(let a=0;a<16;a++)
        {
            if(chunk.subchunks[a]==undefined) continue;
            const c = new Array3D(16,16,16);
            for(let x1=0;x1<16;x1++)
                for(let y1=0;y1<16;y1++)
                    for(let z1=0;z1<16;z1++)
                    {
                        if( chunk.subchunks[a].blocks[x1][y1][z1]==undefined || chunk.subchunks[a].blocks[x1][y1][z1]==null) 
                            c[x1][y1][z1]=0;
                        else
                            c[x1][y1][z1]=chunk.subchunks[a].blocks[x1][y1][z1].id;
                    }
            blocks[a] = c;
        }
        this.minimalStorage.push(
            {
                pos:[chunk.pos.x,chunk.pos.z],
                blocks:blocks
            }
        );
    }
    public static getChunkAt(x:number,z:number):Chunk | undefined
    {
        for(let i=0;i<this.loadedChunks.length;i++)
            if(this.loadedChunks[i].pos.x == x && this.loadedChunks[i].pos.z == z)
                return this.loadedChunks[i];
        return undefined;
    }
    public static renderDebug()
    {
        CanvaManager.debug.innerText = "Fps: "+this.Measure.fps+" Selected block: "+ blocks[this.player.itemsBar[this.player.selectedItem].id].name +" Count:"+this.player.itemsBar[this.player.selectedItem].count+
      "\n XYZ:  X:"+(Math.floor(this.player.pos.x*100)/100)+"  Y:"+(Math.floor(this.player.pos.y*100)/100)+"  Z:"+(Math.floor(this.player.pos.z*100)/100)+"\nFast break [8]: "+this.fastBreaking+" Fly[9]: "+this.fly+"\n Sky light [4][5]:"+this.sunLight
     +"\n Visible chunks[6][7]: "+this.maxChunks+"\n    Heightmap:"+World.getHeightMap(this.player.pos);
    }
    public static render()
    {
        this.Measure.frames++;
  
        this.renderDebug();
        this.shader.use();
        this.player.camera.preRender();
        this.shader.setFog(this.player.camera.getPosition(),Math.sqrt(this.maxChunks)*8);
        CanvaManager.preRender();
        gl.clearColor(0.43*(this.sunLight/15) ,0.69 *(this.sunLight/15),(this.sunLight/15),1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
   
       Texture.blockAtlas.bind();
    
        Main.shader.loadUniforms(Main.player.camera.getProjection(), Matrix4.identity(), Main.player.camera.getView(),Main.sunLight);
        for(const chunk of this.loadedChunks)
        {
        
            chunk.render();   
        
        } 
        for(let i=0;i<this.entities.length;i++)
        {
            this.entities[i].render();
        }
        this.player.render();
        this.gui.render();
    }
}
Main.run();