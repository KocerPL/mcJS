import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Scene } from "../../Engine/Scene.js";
import { Task } from "../../Engine/Task.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix4 } from "../../Engine/Utils/Matrix4.js";
import { Vector4 } from "../../Engine/Utils/Vector4.js";
import { Main } from "../../Main.js";
import { Block, RotatableBlock, Side } from "../Block.js";
import { Chunk } from "../Chunk.js";
import { Entity } from "../Entity.js";
import { Player } from "../Player.js";
import { SubChunk } from "../SubChunk.js";
import { World } from "../World.js";
import { PlayerEntity, PlayerRotations } from "../entities/PlayerEntity.js";
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
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { TextInput } from "../gui/TextInput.js";
import { InlineTextInput } from "../gui/InlineTextInput.js";
import { GuiComponent } from "../gui/GuiComponent.js";
import { clamp, roundTo } from "../../Engine/Utils/Math.js";
import { Lighter } from "../../Lighter.js";
import { SkyLighter } from "../../SkyLighter.js";
declare let io;
const gl = CanvaManager.gl;
export class GameScene extends Scene
{
    onKey(key:string) {
        //  console.log(key);
        if(key=="`")
        {
            this.switchChat();
        }
        else
            this.gui.onKey(key);
    }
  
    public maxChunks =10;
    public maxSubUpdates = 1;
    public okok = false;
    public dispLl = false;
    public fly =false;
    public fastBreaking=false;
    public renderGUI =true;
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
    public cross:Cross;
    public player:Player ;
    public audio =new Audio("./res/music/kocecraftvol1.ogg");
    public walkSound = new Audio("./res/sounds/walk.ogg");
    public mineSound = new Audio("./res/sounds/mine.ogg");
    public range = {start:0, end:1};
    //public static chunks:Array<Array<Chunk>>=new Array(8);
    public chunkQueue:Set<Chunk> = new Set(); 
    public loadedChunks:Map<string,Chunk> = new Map();
    public toUpdate:Set<SubChunk> = new Set();
    public  integratedServer:Worker;
    public logged =false;
    private lastChatClosed =0;
    private counter =0;
    private fromSlot =0;
    public keyLock =false;
    private isInv =false;
    private getNearestSubchunk():SubChunk
    {
        const plPos = this.toChunkPos(this.player.pos.copy());
        let clDistance = Number.POSITIVE_INFINITY;
        let clSub:SubChunk = undefined;
        for(const sc of this.toUpdate)
        {
            if(!sc.chunk.allNeighbours) 
            {
             
                // console.log( "Not enough neighbours",sc.chunk.neighbours);
                sc.chunk.sendNeighbours(this);
                if(!sc.chunk.allNeighbours) 
                {
                    sc.chunk.deleteSubchunksFromQueue(this);
                    continue;
                }
            }
            const dist =Vector4.distance(plPos,sc.pos);
            if(sc.mesh.count<=0)
            {
                return sc;
                clDistance =dist;
                clSub = sc;
                continue;
            }
            if( dist<clDistance)
            {
                clDistance =dist;
                clSub = sc;
            }
        }
        return clSub;
        
    }
    private async updateSubchunk()
    {
        //const concatQ:Set<Chunk> = new Set();
        const entry:SubChunk =this.getNearestSubchunk();// this.toUpdate.entries().next().value[0];
        //console.log("running...",entry);
    
        //    console.log(entry[0].pos);
        if(entry)
        {
   
           
            entry.update(this).then(async()=>{
                // console.log("updating...");
                entry.chunk.updateMesh();
                this.toUpdate.delete(entry);
                //   occasionalSleeper().then(()=>{
                //     this.updateSubchunk();
                // });
                //  console.log("Update",entry);
                await this.occasionalSleeper();
                this.updateSubchunk();
            }).catch(()=>{
                setTimeout( ()=>{ this.updateSubchunk();},0);
            });
        }
        else
        {
            setTimeout( ()=>{ this.updateSubchunk();},100);
        }    //  concatQ.add(entry[0].chunk);
       
        // concatQ.forEach((chunk) =>{chunk.updateMesh();});
    
    }
    public handleSubchunk(ev)
    {
       
        let chunk = this.getChunkAt(ev.data.subX,ev.data.subZ);
        if(chunk==undefined)
        {
            chunk = new Chunk(ev.data.subX,ev.data.subZ);
            this.loadedChunks.set(chunk.pos.x+"-"+chunk.pos.z,chunk);
        }
        //    console.log(ev.data);
        chunk.subchunks[ev.data.subY] = new SubChunk(new Vector4(ev.data.subX,ev.data.subY,ev.data.subZ),chunk);
        for(let x=0;x<16;x++)    for(let y=0;y<16;y++)    for(let z=0;z<16;z++)
        {
            const bl = new Block(ev.data.blocks[x+(y*16)+(z*256)]);
            bl.skyLight = 0;
            // bl.sideTop = Side.left;
            chunk.subchunks[ev.data.subY].blocks[x][y][z]=bl;
            // chunk.subchunks[ev.data.subY].blocks[x][y][z]
        }
        for(let i=0;i<16;i++)
            if(!chunk.subchunks[i])
                return;
        this.chunkQueue.add(this.getChunkAt(ev.data.subX,ev.data.subZ));
        //console.log("Chunk at: x:"+ ev.data.subX+" z:"+ev.data.subZ+"is ready to be loaded");
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
        this.audio.play();
        this.audio.volume = 0.3;
        this.gui.add(new TextComponent("debug","FPS:",0.01,null,ALIGN.left,true)).transformation =Matrix3.identity().translate(-1,0.98);
        const db =this.gui.get("debug");
        if(db instanceof TextComponent)
            db.background=new Vector4(0.0,0.0,0.0,0.4);
        const chat=  this.gui.add(new TextComponent("chat","",0.01,null,ALIGN.left,false));
        const chatIn =this.gui.add(new InlineTextInput("chatInput",""));
        chat.transformation =Matrix3.identity().translate(-1,0);
        if(chat instanceof TextComponent)
        {
            chat.background = new Vector4(0.0,0.0,0.0,0.3);
            chat.lineBreakLimit =10;
        }
        if(chatIn instanceof InlineTextInput)
        {
            chatIn.background = new Vector4(0.0,0.0,0.0,0.3);
            chatIn.unselect();
        }
        const testButton  =new Button("test");
        testButton.transformation = Matrix3.identity().translate(0.9,0.85).scale(0.2,0.2);
        testButton.setVisible = false;
        testButton.onclick = ()=>{
            let ti = this.gui.get("debuginput_text_in");
            let name ="body";
            let pName = "x";
            if(ti instanceof TextInput)
            {
                const sp =  ti.text.split(".");
                if(sp.length<2)
                    return;
                name =sp[0];
                pName = sp[1];
            }
            ti = this.gui.get("debuginputvalue_text_in");
            let val ="0";
            if(ti instanceof TextInput)
            {
                val = ti.text;
            }
            this.player.entity.rotations[name][pName] = Number.parseFloat(val);
        };
        
        this.gui.add(testButton);
        testButton.changeText("Set");
        //    this.gui.add(new BorderedTextInput("debuginput","body.x")).transformation =  Matrix3.identity().translate(0.9,0.95).scale(0.2,0.2);
        //  this.gui.add(new BorderedTextInput("debuginputvalue","0")).transformation =  Matrix3.identity().translate(0.9,0.9).scale(0.2,0.2);
        const ds =this.gui.add(new DarkScreen("ExitDarkScreen"));
        const butt = new Button("Exit game");
        ds.add(butt);
        butt.changeText("Exit game");
        butt.onclick = ()=>{
            this.socket.disconnect();
            delete this.socket;
            Main.changeScene(new MenuScene());          
        };
        //  butt.changeText("Exit game");
        const mi = this.gui.add(new ItemHolder("mouse_item_holder",0.02)); 
        for(let i=1;i<=9;i++)
        {
            const slot = this.gui.get("slot_"+i);
            slot.onclick = ()=>{
                const plSlot =this.player.itemsBar[i-1];
                
                if(mi instanceof ItemHolder)
                    if(mi.blockID == 0)
                    {
                        this.fromSlot = i-1;
                        this.isInv = false;
                        mi.change(plSlot.id,plSlot.count);
                        this.player.updateItem(0,i-1,0);
                    }
                    else
                    {
                        if(plSlot.id>0)
                        {
                            this.socket.emit("moveItem",{slot1:i-1,isInv1:false, slot2:this.fromSlot,isInv2:this.isInv});
                            //this.player.updateItem(mi.blockID,i-1,mi.count);
                            //mi.change(blID,count); 
                            mi.change(0,0);
                        }
                        else
                        {
                            this.socket.emit("moveItem",{slot1:i-1,isInv1:false, slot2:this.fromSlot,isInv2:this.isInv});
                            //this.player.updateItem(mi.blockID,i-1,mi.count);
                            mi.change(0,0); 
                        }
                  
                    }
                console.log("Clicked "+i+" slot");
            };
        }
        for(let i=1;i<=27;i++)
        {
            const slot = this.gui.get("invSlot_"+i);
            slot.onclick = ()=>{
                const plSlot =this.player.inventory[i-1];
                
                if(mi instanceof ItemHolder)
                    if(mi.blockID == 0)
                    {
                        this.fromSlot = i-1;
                        this.isInv = true;
                        mi.change(plSlot.id,plSlot.count);
                        this.player.updateInvItem(0,i-1,0);
                    }
                    else
                    {
                        if(plSlot.id>0)
                        {
                            this.socket.emit("moveItem",{slot1:i-1,isInv1:true, slot2:this.fromSlot,isInv2:this.isInv});
                            // this.player.updateInvItem(mi.blockID,i-1,mi.count);
                            // mi.change(blID,count);
                            mi.change(0,0); 
                        }
                        else
                        {
                            this.socket.emit("moveItem",{slot1:i-1,isInv1:true, slot2:this.fromSlot,isInv2:this.isInv});
                            // this.player.updateInvItem(mi.blockID,i-1,mi.count);
                            mi.change(0,0); 
                        }
                  
                    }
                console.log("Clicked "+i+" slot");
            };
        }
        this.player = new Player(new Vector4(-2,144,-7),this);
        this.gui.get("Inventory").setVisible = this.player.openInventory;
        this.socket.emit("login",{nick:Main.shared.nick});
        this.socket.on("subchunk",this.handleSubchunk.bind(this));
        //socket.emit('addItem',{id:1,count:64,slot:0});
        this.socket.on("loginFailed",(str)=>{
            console.error(str);
            Main.changeScene(new MenuScene());
        });
        this.socket.on("updateItem",(obj:{id:number,count:number,slot:number,inventory:boolean})=>{
            if(obj.inventory)
                this.player.updateInvItem(obj.id,obj.slot,obj.count);
            else
                this.player.updateItem(obj.id,obj.slot,obj.count);
        });
        this.socket.on("message",(text:string)=>{
            let change =false;
            for(let i=0; i<text.length;i++)
            {
                if((i+1)%40==0)
                    change=true;
                if(change && text.at(i)==" ")
                {
                    const arr = text.split("");
                    arr[i]="\n";
                    text = arr.join("");
                    change =false;
                }
            }
            if(chat instanceof TextComponent)
            {
                chat.appendText("\n"+text);
                chat.transparency=1;
            }
            this.lastChatClosed = Date.now();
            
        });
        this.socket.on("updateEntity",(obj:{uuid:number,pos:Vector4})=>
        {
            for(const ent of this.entities)
                if(ent.UUID == obj.uuid)
                {
                    ent.addNextTransitions(new Vector4(obj.pos.x,obj.pos.y,obj.pos.z),3);
                }
        });
        this.socket.on("spawnPlayer",(pos,id)=>{
            // console.log("summoningPLAYER");
            this.entities.push(new PlayerEntity(new Vector4(pos.x,pos.y,pos.z),this,id));
        });
        this.socket.on("moveEntity",(id,pos:Vector3,rots:PlayerRotations)=>{
            const ent=  this.getEntity(id);
           
            // ent.pos =new Vector4(pos.x,pos.y,pos.z);
            if(ent instanceof PlayerEntity)
            { const plRots = new PlayerRotations();
                for(const name in plRots)
                {
                    plRots[name].x =  rots[name].x;
                    plRots[name].y =  rots[name].y;
                    plRots[name].z =  rots[name].z;
                }
                ent.setNextTransitions(new Vector4(pos.x,pos.y,pos.z),plRots,3);
            }
        });
        
        this.socket.on("login",(posStr:string,id)=>{
            this.player.id = id;
            const pos =JSON.parse(posStr);
            this.player.pos = new Vector4(pos.x,pos.y,pos.z);
            this.logged=true;
        });
        this.socket.io.on("reconnect",()=>{
            location.reload();
        });
        this.socket.on("spawnEntity",(data)=>{
            console.log("Spawn: "+data.uuid);
            console.log(data);
            for(let i=0; i<this.entities.length;i++)
            {
                if(this.entities[i].UUID ==data.uuid)
                {
                    console.log("ENTITY EXIST NOT ADDING NEW!!");
                    //this.entities.splice(i,1);
                    return;
                }
            }
            if(data.type == "item")
                this.entities.push(new Item(Vector4.fromData(data.pos),data.id,this,data.uuid));
        });
        this.socket.on("placeBlock",(data)=>{
            if(data.id!=0)
                World.placeBlock(new Vector4(data.pos.x,data.pos.y,data.pos.z),data.id,this);
            else
                World.breakBlock(new Vector4(data.pos.x,data.pos.y,data.pos.z),this);
        });
        this.socket.on("killEntity",(uuid)=>{
            console.log("KILL: "+uuid);
            for(let i=0; i<this.entities.length;i++)
            {
                if(this.entities[i].UUID ==uuid)
                {
                    this.entities.splice(i,1);
                    return;
                }
            }
            console.log("Entity not found!!");
        });
        this.onKey("`");
        this.onKey("`");
        this.updateSubchunk();
        Lighter.processNode(this);
        SkyLighter.processNode(this);
    }
    onClick()
    {
        this.gui.onClick();
    }
    checkAndAddChunk(pPC:Vector4,time:number)
    {
        if(!this.loadedChunks.has(pPC.x+"-"+pPC.z))
        {
            // console.log("LOADING: "+pPC.x+"  "+pPC.z);
            this.loadedChunks.set(pPC.x+"-"+pPC.z,new Chunk(pPC.x,pPC.z));
            for(let i=15;i>=0;i--)
                this.socket.emit("getSubchunk",pPC.x,i,pPC.z);
        }
        this.loadedChunks.get(pPC.x+"-"+pPC.z).lastUsed= time;
    }
    updateChunks()
    {
        const pPC =this.toChunkPos(this.player.pos);
        //   console.log(pPC);
        let i=1;
        let step=1;
        const time = Date.now();
       
        this.checkAndAddChunk(pPC,time);
        while(i<this.maxChunks)
        {
            // console.log("LOADUNG: "+pPC.x+"  "+pPC.z);
               
            for(let j=0;j<i;j++)
            {
                pPC.x+=step;
                this.checkAndAddChunk(pPC,time);
            
                //pPC.x+=step;
            }
            for(let j=0;j<i;j++)
            {
                pPC.z+=step;
                this.checkAndAddChunk(pPC,time);
             
            }
            step=-step;
            i++;
        }
        for(const data of this.loadedChunks)
        {
            if(data[1].lastUsed+5000<time)
            {
                data[1].deleteNeighbours(this);
                console.log("Removing...");
                this.loadedChunks.delete(data[0]);
            }
        }
    }
    keyUpdate()
    {
        if(CanvaManager.getKeyOnce("ENTER"))
        {
            const txt = this.gui.get("chatInput_text_in");
            console.log(txt);
            let gComp:GuiComponent =undefined;
            if(txt instanceof TextInput && txt.selected)
            {
                if(txt.getText().startsWith("/"))
                {
                    const cmd = txt.getText().split(" ");
                    switch(cmd[0])
                    {
                    case "/logchunk":
                        console.log(  this.loadedChunks.get(Math.floor(this.player.pos.x/16)+"-"+Math.floor(this.player.pos.z/16)));
                        break;
                    case "/logslength":
                        gComp= this.gui.get("chat");
                        console.log(this.toUpdate);
                        if(gComp instanceof TextComponent)
                            gComp.appendText("\n"+this.toUpdate.size);
                        break;
                    case "/tp":
                        gComp= this.gui.get("chat");
                        console.log(this.toUpdate);
                        if(gComp instanceof TextComponent)
                        { 
                            if(cmd.length>3)
                            {
                                this.player.pos = new Vector4(Number.parseFloat(cmd[1]),Number.parseFloat(cmd[2]),Number.parseFloat(cmd[3]));
                                gComp.appendText("\nTelleported to: x:"+roundTo(this.player.pos.x,2)+" y:"+roundTo(this.player.pos.y,2)+" z:"+roundTo(this.player.pos.z,2));
                            }
                            else
                                gComp.appendText("\nNot enough arguments, expected: /tp <x> <y> <z>");
                        }

                    }
                }
                else
                    this.socket.emit("message",txt.getText());
                this.switchChat(false);
                txt.changeText("");
            }
        }
        if(CanvaManager.getKeyOnce("F10")) 
        {
            this.keyLock= !this.keyLock;
        } 
        if(this.keyLock) return;
        if(CanvaManager.getKeyOnce("6"))    console.log(World.getSubchunk(this.player.pos,this));
        if(CanvaManager.getKey("5")&&this.sunLight<16) this.sunLight++;
        if(CanvaManager.getKey("4")&&this.sunLight>0) this.sunLight--;  
        if(CanvaManager.getKeyOnce("E"))
        { 
            this.player.openInventory = !this.player.openInventory;
            this.gui.get("DarkScreen").setVisible = this.player.openInventory;
            this.gui.get("Inventory").setVisible =  this.player.openInventory;
            CanvaManager.rPointer = !this.player.openInventory;
            const mi = this.gui.get("mouse_item_holder"); 
            if(mi instanceof ItemHolder)
                if(mi.blockID != 0)
                {
                    mi.change(0,0);  
                }
            if(!CanvaManager.rPointer) CanvaManager.unlockPointer();
        }
        
        if(CanvaManager.getKeyOnce("ESCAPE")) this.gui.get("ExitDarkScreen").setVisible =  !this.gui.get("ExitDarkScreen").getVisible;
        // this.count++;
        // if(this.count>this.test.indices.length)
        //this.count=3;
        
        if(CanvaManager.getKeyOnce("]"))
            this.maxChunks--;
        if(CanvaManager.getKeyOnce("["))
            this.maxChunks++;
        if(CanvaManager.getKeyOnce("8"))
            this.fastBreaking=!this.fastBreaking;
        if(CanvaManager.getKeyOnce("9"))
            this.fly=!this.fly;
        if(CanvaManager.getKeyOnce("F2"))
            this.renderGUI=!this.renderGUI;
    }
    update() {
        this.gui.get("mouse_item_holder").transformation = Matrix3.identity().translate(CanvaManager.mouse.pos.x,CanvaManager.mouse.pos.y);
        this.processChunks();
        //  this.updateSubchunks();
        if(this.logged)
            this.updateChunks();
       
       
        // if(CanvaManager.getKeyOnce("F2")) {this.cross.setVisible =!this.cross.getVisible;}
        this.keyUpdate();
          
        for(let i=0;i<this.entities.length;i++)
        {
            this.entities[i].update(i);
        }
        this.player.update();
    }
    render() {
        gl.clearColor(0.43*(this.sunLight/15) ,0.69 *(this.sunLight/15),(this.sunLight/15),1.0);
        this.counter++;
        if(this.counter>10)
        {
            this.counter=0;
            const txt = this.gui.get("debug");
            if(txt instanceof TextComponent)
            {
                txt.changeText("FPS:"+ Main.Measure.fps+"\nPosition: X:"+roundTo(this.player.pos.x,2)+" Y:"+roundTo(this.player.pos.y,2)+ " Z:"+roundTo(this.player.pos.z,2));
                txt.transformation =Matrix3.identity().translate(-(CanvaManager.getWidth/CanvaManager.getHeight),0.98);
            }
            const chatTxt =  this.gui.get("chat");

            const chatIn  = this.gui.get("chatInput");
            if(chatTxt instanceof TextComponent)
            {
                chatTxt.transformation =Matrix3.identity().translate(-(CanvaManager.getWidth/CanvaManager.getHeight),-0.93);
                if(!this.keyLock)
                {
                    if(this.lastChatClosed+5000<Date.now())
                        chatTxt.transparency= clamp(chatTxt.transparency-0.05,0,1);
                }
            }
            chatIn.transformation =Matrix3.identity().translate(-(CanvaManager.getWidth/CanvaManager.getHeight),-0.97).scale(0.4,0.4);

        }
        Main.shader.use();
        this.player.camera.preRender();
        Main.shader.setFog(this.player.camera.getPosition(),(this.maxChunks-4)*8);
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
        if(this.renderGUI)
            this.gui.render();
       
    }
    public getEntity(id)
    {
        for(const entity of this.entities)
        {
            if(entity.UUID == id)
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
    public processChunks()
    {
        for(const chunk of this.chunkQueue)
        {
            if(chunk.isSubArrayReady())
            {
                chunk.prepareLight();
                chunk.sendNeighbours(this);
                this.chunkQueue.delete(chunk);
            }
        }
    }
    public toChunkPos(vec:Vector4)
    {
        return new Vector4(Math.floor(Math.round(vec.x)/16),Math.floor(Math.round(vec.y)/16),Math.floor(Math.round(vec.z)/16));
    }
    switchChat(val?:boolean)
    {
        const txt = this.gui.get("chatInput_text_in");
        if(txt instanceof TextInput)
        {
            
            this.keyLock =val?? !this.keyLock;
            if(!this.keyLock) this.lastChatClosed = Date.now();
            txt.setVisible = this.keyLock;
            txt.selected = this.keyLock;
            const chat = this.gui.get("chat");   
            if(this.keyLock)
                chat.transparency=1;
        }
    }
    public occasionalSleeper = (function() {
        //
        let lastSleepingTime = performance.now();
        return function() {
            if (performance.now() - lastSleepingTime > 20) {
                lastSleepingTime = performance.now();
                return new Promise(resolve => setTimeout(resolve, 0));
            } else {
                return Promise.resolve();
            }
        };
    }());
    
}
