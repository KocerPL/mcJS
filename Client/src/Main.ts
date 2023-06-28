import { CanvaManager } from "./Engine/CanvaManager.js";
import { EBO } from "./Engine/EBO.js";
import { AtlasShader } from "./Engine/Shader/AtlasShader.js";
import { DefaultShader } from "./Engine/Shader/DefaultShader.js";
import { Shader2d } from "./Engine/Shader/Shader2d.js";
import { Task } from "./Engine/Task.js";
import { Texture } from "./Engine/Texture.js";
import { Array3D } from "./Engine/Utils/Array3D.js";
import { Matrix } from "./Engine/Utils/Matrix.js";
import { Vector } from "./Engine/Utils/Vector.js";
import { VAO } from "./Engine/VAO.js";
import { VBO } from "./Engine/VBO.js";
import { Block, blocks } from "./Game/Block.js";
import { Chunk } from "./Game/Chunk.js";
import { Entity } from "./Game/Entity.js";
import { GUI } from "./Game/GUI.js";
import { Player } from "./Game/Player.js";
import { SubChunk } from "./Game/SubChunk.js";
import { World } from "./Game/World.js";
import { PlayerEntity } from "./Game/entities/PlayerEntity.js";
const gl = CanvaManager.gl;
declare const io;
export class LightNode
{
    pos:Vector;
    subchunk:SubChunk;
    light:number;
    direction:number;
    lpos:Vector;
    constructor(pos:Vector,subchunk:SubChunk,light:number,direction:number,lightpos?:Vector)
    {
        this.lpos = lightpos;
        this.pos = pos;
        this.subchunk = subchunk;
        this.light = light;
        this.direction = direction;
    }
}
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
    public static file = null;
    public static entities:Array<Entity> = [];
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
    private static crossVAO:VAO;
    private static fastDelta=0;
    private static lastFastTick=0;
    public static player = new Player(new Vector(-2,144,-7));
    public static range = {start:0, end:1};
    //public static chunks:Array<Array<Chunk>>=new Array(8);
    public static chunkQueue:Array<Chunk> = []; 
    public static loadedChunks:Array<Chunk> = [];
    private static tempChunkBuffer:Array<Chunk> = [];
    public static lightQueue:Array<LightNode>= [];
    public static skyLightQueue:Array<LightNode> = [];
    public static skyLightRemQueue:Array<LightNode> = [];
    public static lightRemQueue:Array<LightNode> = [];
    public static toUpdate:Set<SubChunk> = new Set();
    public static integratedServer:Worker;
    private static crosscords = [
        -0.02,-0.02,
        0.02,0.02,
        -0.02,0.02,
        0.02,-0.02
    ];
    private static crosstcords = [
        0,0,
        9,9,
        0,9,
        9,0
    ];
    private static crossindices =[
        0,1,2, 3,1,0
    ];
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
        // EBO.unbind();
        // VBO.unbind();
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        // gl.enable(gl.CULL_FACE);
        // gl.cullFace(gl.BACK);
        //Transparency requires blending 
        gl.enable (gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        //Shader for world
        this.shader = new DefaultShader();
        this.atlasShader = new AtlasShader();
        //shader for GUI(2d)
        this.shader2d = new Shader2d();
        //loading crosshair 
        GUI.init();
        this.crossVAO = new VAO();
        const vbo = new VBO();
        vbo.bufferData(this.crosscords);
        this.crossVAO.addPtr(0,2,0,0);
        const vtc = new VBO();
        vtc.bufferData(this.crosstcords);
        this.crossVAO.addPtr(1,2,0,0);
        const ebo = new EBO();
        ebo.bufferData(this.crossindices);
        VAO.unbind();
        VBO.unbind();
        EBO.unbind();
        //init world
        World.init();
        for(let i=0;i<this.tasks.length;i++)
        {
            this.tasks[i]=[];
        }
        //loading chunks
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
    private static fastUpdate()
    {
        this.player.update();
    }
    public static update()
    {
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
        for(let i=0;i<this.entities.length;i++)
        {
            this.entities[i].update(i);
        }
        GUI.update();
        if(CanvaManager.getKeyOnce(54))
            this.maxChunks--;
        if(CanvaManager.getKeyOnce(55))
            this.maxChunks++;
        if(CanvaManager.getKeyOnce(56))
            this.fastBreaking=!this.fastBreaking;
        if(CanvaManager.getKeyOnce(57))
            this.fly=!this.fly;
    }
    private static async limitChunks()
    {
        const x =Math.floor(Math.round(this.player.pos.x)/16);
        const z =Math.floor(Math.round(this.player.pos.z)/16);
      
        let step=1;
        let iter =1;
        const howMuch=this.maxChunks;
        const loadBuffer = [];
        this.tempChunkBuffer = [...this.loadedChunks];
        const {chunk,isNew} =  this.getORnew(x,z);
        if(isNew) chunk.preGenSubchunks();
        loadBuffer.push(chunk);
        const nextCoords= new Vector(x,0,z);
        //Spiral chunk loading algorithm
   
        let stop = false;
        while(loadBuffer.length<howMuch)
        {
            //x
            for(let i=0;i<iter;i++)
            {
                nextCoords.x+=step;
                const {chunk} = this.getORnew(nextCoords.x,nextCoords.z);
                loadBuffer.push(chunk);
              
                if(!chunk.generated) {chunk.preGenOne();stop =true; break; }
                else if(!chunk.sended){
                    chunk.sendNeighbours();
                    //chunk.gatherNeighbours();
                    chunk.sended =true;
                    stop =true;
                    break;
                }
            }
            //z
            if(stop) break;
            for(let i=0;i<iter;i++)
            {
                nextCoords.z+=step;
                const {chunk} = this.getORnew(nextCoords.x,nextCoords.z);
                // stop = isNew;
                loadBuffer.push(chunk);
                if(!chunk.generated) {chunk.preGenOne();
                    stop =true; break; }else if(!chunk.sended){
                    chunk.sendNeighbours();
                    // chunk.gatherNeighbours();
                    chunk.sended =true;
                    stop =true;
                    break;
                }
            }
            //increase and invert step
            if(stop) break;
            iter++;
            step= -step;
        }
        this.loadedChunks=loadBuffer;
    
        for(const chunk of this.tempChunkBuffer)
        {
            chunk.sended = false;
            for(let i=this.entities.length-1; i>=0;i--)
            {
                const entity = this.entities[i];
                if(chunk.pos.x*16 < entity.pos.x && chunk.pos.z*16 < entity.pos.z && chunk.pos.x*16 > entity.pos.x-16 && chunk.pos.z*16 < entity.pos.z-16)
                    this.entities.splice(i,1);
            }
        }
        this.unloadedChunks = this.unloadedChunks.concat([...this.tempChunkBuffer]);
    }
    private static getORnew(x:number,z:number):{chunk:Chunk,isNew:boolean}
    {
        for(let l=0;l<this.tempChunkBuffer.length;l++)
            if(this.tempChunkBuffer[l].pos.x == x && this.tempChunkBuffer[l].pos.z == z)
            {
                return  {chunk:[...this.tempChunkBuffer.splice(l,1)][0],isNew:false};
        
            }

        for(let l=0;l<this.unloadedChunks.length;l++)
            if(this.unloadedChunks[l].pos.x == x && this.unloadedChunks[l].pos.z == z)
            {
                return  {chunk:[...this.unloadedChunks.splice(l,1)][0],isNew:false};
        
            }
        return {chunk: new Chunk(x,z),isNew:true}; 
    }
    public static exportChunks()
    {
        const k = [];
        for(let x=0;x<this.loadedChunks.length;x++)
        {
            const chunk  =this.loadedChunks[x];
            //  console.log(chunk);
            if(chunk==undefined) continue;
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
            k.push(
                {
                    pos:[chunk.pos.x,chunk.pos.z],
                    blocks:blocks
                }
            );
        }
        k.push({pPos:[this.player.pos.x,this.player.pos.y,this.player.pos.z]});
        this.download(JSON.stringify(k),"world.json","text/plain");
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
    public static download(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    public static upload() {
        const a = document.createElement("input");
        a.type="file";
   
        a.click();
        a.oninput = ()=>{
            //console.log(file);
            const reader = new FileReader();
            let ok;
            reader.onload =(okok)=>{
                ok = okok.target.result;
                this.file =JSON.parse(ok);
                console.log(this.file);
            };
            console.log(ok);
            //JSON.parse(file);
    

        };

    }
    public static render()
    {
        this.Measure.frames++;
        CanvaManager.debug.innerText = "Fps: "+this.Measure.fps+" Selected block: "+ blocks[this.player.itemsBar[this.player.selectedItem].id].name +" Count:"+this.player.itemsBar[this.player.selectedItem].count+
      "\n XYZ:  X:"+(Math.floor(this.player.pos.x*100)/100)+"  Y:"+(Math.floor(this.player.pos.y*100)/100)+"  Z:"+(Math.floor(this.player.pos.z*100)/100)+"\nFast break [8]: "+this.fastBreaking+" Fly[9]: "+this.fly+"\n Sky light [4][5]:"+this.sunLight
     +"\n Visible chunks[6][7]: "+this.maxChunks+"\n    Heightmap:"+World.getHeightMap(this.player.pos);
      
        this.shader.use();
        this.player.camera.preRender();
        this.shader.setFog(this.player.camera.getPosition(),Math.sqrt(this.maxChunks)*8);
        CanvaManager.preRender();
        gl.clearColor(0.43*(this.sunLight/15) ,0.69 *(this.sunLight/15),(this.sunLight/15),1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
   
        gl.bindTexture(gl.TEXTURE_2D_ARRAY,Texture.blocksGridTest);
    
        Main.shader.loadUniforms(Main.player.camera.getProjection(), Matrix.identity(), Main.player.camera.getView(),Main.sunLight);
        for(const chunk of this.loadedChunks)
        {
        
            chunk.render();   
            // toRender.push(()=>{chunk.renderWater()});
        } 
        for(let i=0;i<this.entities.length;i++)
        {
            this.entities[i].render();
        }
        //render crosshair
        this.player.render();
        GUI.render(this.shader2d);
    }
}
Main.run();