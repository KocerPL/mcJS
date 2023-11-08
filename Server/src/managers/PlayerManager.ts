import { Socket } from "socket.io";
import { UUID, paths, Main } from "../Main";
import { randRange } from "../Utils";
import { Vector3 } from "../Utils/Vector3";
import * as fs from "fs";
import { Item } from "../Entities/Item";
import { World } from "../World/World";
import { Vector } from "../Utils/Vector";
export class PlayerInfo
{
    inventory:Array<{id:number,count:number}>=new Array(27);
    itemsBar:Array<{id:number,count:number}>=new Array(9);
    constructor()
    {
        for(let i=0;i<this.inventory.length;i++)
        this.inventory[i] ={ id:Math.floor(randRange(0,11)),count:64};
        for(let i=0;i<this.itemsBar.length;i++)
        this.itemsBar[i] ={ id:0,count:0};
    }
}
export class Player
{
    name:string;
    uuid:UUID;
    socket:Socket;
    pos:Vector3 = new Vector3(0,0,0);
    rot=new Vector(0,0,0);
    inventory = new Array();
    itemsBar = new Array();
    constructor(name:string,socket:Socket,uuid:UUID)
    {
        this.name = name;
        this.socket = socket;
        this.uuid= uuid;
        let plInfo = Main.playerManager.getPlayerInfo(this);
        this.inventory = plInfo.inventory;
        this.itemsBar = plInfo.itemsBar;
        socket.on('moveItem',(data:{slot1:number,isInv1:boolean, slot2:number,isInv2:boolean})=>{
            this.moveItem(data);
          });
          socket.on('getSubchunk',(x:number,y:number,z:number)=>{
            this.getSubchunk(x,y,z); 
        });
              socket.on("playerMove",(pos,rot)=>{
                 this.playerMove(pos,rot);
              });
          socket.on("placeBlock",(data)=>{
              this.placeBlock(data);
          });
          socket.on("disconnect", (reason) => {
              this.disconnect();
            });
    }
    moveItem(data:{slot1:number,isInv1:boolean, slot2:number,isInv2:boolean})
    {

            //  console.log("Moving....");
            console.log(data);
              
              
            if(data.isInv1 && data.isInv2)
            {

            //    console.log("Moved item!!");
            let item = this.inventory[data.slot1];
            this.inventory[data.slot1] = this.inventory[data.slot2];
            this.inventory[data.slot2] = item;
            this.socket.emit("updateItem",{id: this.inventory[data.slot2].id,count: this.inventory[data.slot2].count,slot:data.slot2,inventory:true});
            this.socket.emit("updateItem",{id: this.inventory[data.slot1].id,count: this.inventory[data.slot1].count,slot:data.slot1,inventory:true});   
            } 
            else if(data.isInv1 && !data.isInv2)
            {
                let item =    this.inventory[data.slot1];
              this.inventory[data.slot1] = this.itemsBar[data.slot2];
                this.itemsBar[data.slot2] = item;
                this.socket.emit("updateItem",{id: this.itemsBar[data.slot2].id,count: this.itemsBar[data.slot2].count,slot:data.slot2,inventory:false});
                this.socket.emit("updateItem",{id: this.inventory[data.slot1].id,count: this.inventory[data.slot1].count,slot:data.slot1,inventory:true});
            }
            else if(!data.isInv1 && data.isInv2)
            {
                let item = this.inventory[data.slot2];
                this.inventory[data.slot2] = this.itemsBar[data.slot1];
              this.itemsBar[data.slot1] = item;
                this.socket.emit("updateItem",{id: this.itemsBar[data.slot1].id,count: this.itemsBar[data.slot1].count,slot:data.slot1,inventory:false});
                this.socket.emit("updateItem",{id: this.inventory[data.slot2].id,count: this.inventory[data.slot2].count,slot:data.slot2,inventory:true});
            }
            else if(!data.isInv1 && !data.isInv2)
            {
                let item = this.itemsBar[data.slot2];
                this.itemsBar[data.slot2] = this.itemsBar[data.slot1];
                this.itemsBar[data.slot1] = item;
                this.socket.emit("updateItem",{id: this.itemsBar[data.slot1].id,count: this.itemsBar[data.slot1].count,slot:data.slot1,inventory:false});
                this.socket.emit("updateItem",{id: this.itemsBar[data.slot2].id,count: this.itemsBar[data.slot2].count,slot:data.slot2,inventory:false});
            }
            Main.playerManager.savePlayerInfo();
    }
    playerMove(pos,rot)
    {
        this.pos =pos;
        this.rot=rot;
        this.socket.broadcast.emit("moveEntity",this.uuid,pos,rot);
    }
    getSubchunk(x,y,z)
    {
        
        const chunk = Main.world.getChunk(x,z);
        for( let ent of chunk.entities)
        if((ent.pos.y/16)>y && (ent.pos.y/16)<y+1)
        {
        this.socket.emit("spawnEntity",{type:ent.type,id:ent instanceof Item?ent.id:2 ,pos:ent.pos,uuid:ent.uuid});
        Main.entityManager.add(ent);
         console.log("ent");
     }
         let data =chunk.subchunks[y];
         this.socket.emit('subchunk', {data:{subX:x,subY:y,subZ:z,blocks:data}})  
    }
    placeBlock(data)
    {
        if(data.id!=0 &&this.itemsBar[data.slot].id != data.id) return;
        if(--this.itemsBar[data.slot].count<=0)
        {
        this.itemsBar[data.slot].id=0;
        this.itemsBar[data.slot].count=0;
        }
        if(data.id!=0)
        this.socket.emit("updateItem",{id:this.itemsBar[data.slot].id,count: this.itemsBar[data.slot].count,slot:data.slot,inventory:false});
     
        Main.playerManager.savePlayerInfo();
       Main.networkManager.io.emit("placeBlock",data);
       let inPos ={x:Math.round(Math.round(data.pos.x)%16),y:Math.round(Math.round(data.pos.y)%16),z:Math.round(Math.round(data.pos.z)%16)};
       if(inPos.x<0)
       inPos.x = 16-Math.abs(inPos.x);
   if(inPos.z<0)
       inPos.z = 16-Math.abs(inPos.z);
       if(inPos.y<0)
       inPos.y = 16-Math.abs(inPos.y);
       const subchunkPos = {x:Math.floor(Math.round(data.pos.x)/16),y:Math.floor(Math.round(data.pos.y)/16),z:Math.floor(Math.round(data.pos.z)/16)};
       let chunk = Main.world.getChunk(subchunkPos.x,subchunkPos.z);
       console.log(subchunkPos.x,subchunkPos.y,subchunkPos.z);
       if(data.id==0)
       {
       this.socket.emit("spawnEntity",{type:"item",id: chunk.subchunks[subchunkPos.y][World.toSubIndex(inPos.x,inPos.y,inPos.z)],pos:data.pos});
        chunk.entities.push(new Item(data.pos, chunk.subchunks[subchunkPos.y][World.toSubIndex(inPos.x,inPos.y,inPos.z)]));
    }
     //  let fdata = JSON.parse(fs.readFileSync(__dirname+"/world/"+subchunkPos.x+"."+subchunkPos.y+"."+subchunkPos.z+".sub").toString());
       chunk.subchunks[subchunkPos.y][World.toSubIndex(inPos.x,inPos.y,inPos.z)] = data.id;
        Main.world.saveChunk(chunk);
    }
    disconnect()
    {
        this.socket.broadcast.emit("killEntity",this.uuid);
        Main.playerManager.remove(this.socket);
    }
}
export class PlayerManager
{
    players:Map<Socket,Player> = new Map();
    playersInfo:Array<PlayerInfo>;
    constructor()
    {
        this.loadPlayerInfo();
    }
    add(player:Player)
    {
        this.players.set(player.socket,player);
    }
    remove(socket:Socket)
    {
        this.players.delete(socket);
    }
    getBySocket(socket:Socket)
    {
        return this.players.get(socket);
    }
    getPlayerInfo(player)
    {
        if(!(player.name in this.playersInfo))
                {
                    this.playersInfo[player.name] = new PlayerInfo();
                    this.savePlayerInfo();
                }
                return  this.playersInfo[player.name];
    }
    loadPlayerInfo()
    {
      this.playersInfo=  JSON.parse(fs.readFileSync(paths.res+"/players.json").toString());
    }
    savePlayerInfo()
{ 
    fs.writeFileSync(__dirname+"/players.json",JSON.stringify(this.playersInfo));

}
}