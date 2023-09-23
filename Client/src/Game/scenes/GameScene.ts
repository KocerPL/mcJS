import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Scene } from "../../Engine/Scene.js";
import { AtlasShader } from "../../Engine/Shader/AtlasShader.js";
import { DefaultShader } from "../../Engine/Shader/DefaultShader.js";
import { Shader2d } from "../../Engine/Shader/Shader2d.js";
import { Task } from "../../Engine/Task.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix4 } from "../../Engine/Utils/Matrix4.js";
import { Vector } from "../../Engine/Utils/Vector.js";
import { Main } from "../../Main.js";
import { Block } from "../Block.js";
import { Chunk } from "../Chunk.js";
import { Entity } from "../Entity.js";
import { Player } from "../Player.js";
import { SubChunk } from "../SubChunk.js";
import { World } from "../World.js";
import { PlayerEntity } from "../entities/PlayerEntity.js";
import { GUI } from "../gui/GUI.js";
import { Inventory } from "../gui/Inventory.js";
import { ItemBar } from "../gui/ItemBar.js";
declare var io;
let gl = CanvaManager.gl;
export class GameScene extends Scene
{
    public maxChunks =128;
    public maxSubUpdates = 5;
    public okok = false;
    public dispLl = false;
    public fly =false;
    public fastBreaking=false;
   // public static minimalStorage = [];
    public sunLight=14;
    public entities:Array<Entity> = [];
    //private static unloadedChunks:Array<Chunk> = [];
    public tasks:Array<Array<Task>> = new Array(11);
    //private static lastTick = 0;
    //private static lastFrame=0;
    public socket = io();
    //private static delta = 0;
    //private static fastDelta=0;
    //private static lastFastTick=0;
    public inv:Inventory;
    public player:Player ;
    public range = {start:0, end:1};
    //public static chunks:Array<Array<Chunk>>=new Array(8);
    public chunkQueue:Array<Chunk> = []; 
    public loadedChunks:Map<string,Chunk> = new Map();
    public toUpdate:Set<SubChunk> = new Set();
    public  integratedServer:Worker;
    private updateSubchunks()
    {
        const concatQ:Set<Chunk> = new Set();
        let i=0;
        for(const entry of this.toUpdate.entries())
        {
            i++;
            if(i>this.maxSubUpdates) break;
            entry[0].update(this);
            concatQ.add(entry[0].chunk);
            console.log("UPDATIGN")
            this.toUpdate.delete(entry[0]);
        }
        concatQ.forEach((chunk) =>{chunk.updateMesh();});
    
    }
    public handleSubchunk(ev)
    {
        console.log("received subchunk");
        let chunk = this.getChunkAt(ev.data.subX,ev.data.subZ);
        if(chunk==undefined)
        {
            chunk = new Chunk(ev.data.subX,ev.data.subZ);
            this.loadedChunks.set(chunk.pos.x+"-"+chunk.pos.z,chunk);
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
        this.chunkQueue.push(this.getChunkAt(ev.data.subX,ev.data.subZ));
    }
    public handleChunkReady(ev)
    {
        console.log("received chunk ready");
        this.chunkQueue.push(this.getChunkAt(ev.data.chunkX,ev.data.chunkZ));
    }
    start() {
        Block.createInfoArray();
        
        this.gui = new GUI(Main.shader2d);
        this.inv = new Inventory("Inventory");
       
        this.gui.add(this.inv);
        this.gui.add(new ItemBar("ItemBar"));
        this.player = new Player(new Vector(-2,144,-7),this);
        this.socket.on("subchunk",(ev)=>{
             
            this.handleSubchunk(ev);
        });
        //socket.emit('addItem',{id:1,count:64,slot:0});
        this.socket.on("addItem",(obj:{id:number,count:number,slot:number})=>{
            this.player.updateItem(obj.id,obj.slot,obj.count);
        });
        this.socket.on("spawnPlayer",(pos,id)=>{
            console.log("summoningPLAYER");
            this.entities.push(new PlayerEntity(new Vector(pos.x,pos.y,pos.z),this,id));
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
                World.placeBlock(new Vector(data.pos.x,data.pos.y,data.pos.z),data.id,this);
            else
                World.breakBlock(new Vector(data.pos.x,data.pos.y,data.pos.z),this);
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
        World.init();
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
    }
    update() {
        if(this.chunkQueue.length>0)
            this.processChunk(this.chunkQueue.shift());
        for(let i=0;i<this.entities.length;i++)
        {
            this.entities[i].update(i);
        }
        this.player.update();
        this.updateSubchunks();
        if(CanvaManager.getKeyOnce(86)) {this.inv.setVisible =!this.inv.getVisible; console.log("VVVVV");}
        if(CanvaManager.getKeyOnce(71)) 
            console.log(World.getSubchunk(this.player.pos,this));
        if(CanvaManager.getKey(52)&&this.sunLight<16)
            this.sunLight++;
        if(CanvaManager.getKey(53)&&this.sunLight>0)
            this.sunLight--;  
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
    render() {
        Main.shader.use();
        this.player.camera.preRender();
        Main.shader.setFog(this.player.camera.getPosition(),Math.sqrt(this.maxChunks)*8);
        CanvaManager.preRender();
        
   
        Texture.testAtkas.bind();
    
        Main.shader.loadUniforms(this.player.camera.getProjection(), Matrix4.identity(), this.player.camera.getView(),this.sunLight);
        for(const val of this.loadedChunks)
        {
        
            val[1].render();   
        
        } 
        for(let i=0;i<this.entities.length;i++)
        {
            this.entities[i].render();
        }
        this.player.render();
        this.gui.render();
        gl.clearColor(0.43*(this.sunLight/15) ,0.69 *(this.sunLight/15),(this.sunLight/15),1.0);
    }
    public getEntity(id)
    {
        for(const entity of this.entities)
        {
            if(entity.ID == id)
                return entity;
        }
    }
    public getChunkAt(x:number,z:number):Chunk | undefined
    {
        const ch = this.loadedChunks.get(x+"-"+z);
        if(ch)
            return ch;
        return undefined;
    }
    public processChunk(chunk:Chunk)
    {
        chunk.prepareLight();
        chunk.sendNeighbours(this);
    }
    
}