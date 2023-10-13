import express = require("express");
import http = require("http");
const { Server } = require("socket.io");
import fs = require('fs');
import { Chunk } from "./World/Chunk";
import { Generator } from "./World/Generator";
import { randRange } from "./Utils";
let lastID=0;
const app = express();
const gen = new Generator();
const server =http.createServer(app);
const io = new Server(server);
class PlayerInfo
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
const loadedChunks:Map<string,Chunk> = new Map();
let playersInfo = JSON.parse(fs.readFileSync(__dirname+"/players.json").toString());
let pos=__dirname.length-1;
for(let i=0;i<2;pos--)
{
    if(__dirname.at(pos)=="/")
        i++;
}
const rDir = __dirname.substring(0,pos+1);

app.get("/",(req,res)=>{
    res.sendFile(rDir+"/Client/index.html");
});

io.on('connection', (socket:any) => {
    //console.log('a user connected');
    socket.KOCEid = lastID++;
    socket.pos = {x:0,y:200,z:0};
    socket.on("login",(loginObject)=>
    {
    socket.nick = loginObject.nick;
    console.log(loginObject.nick+" logged in"); 
    socket.emit('login',{x:0,y:200,z:0}, socket.KOCEid);
  // console.log(io.sockets);
        if(!(socket.nick in playersInfo))
        {
            playersInfo[socket.nick] = new PlayerInfo();
            savePlayerInfo();
        }
        let inventory = playersInfo[socket.nick].inventory;
        for(let i=0;i<inventory.length;i++)
        {
           socket.emit('updateItem',{id:inventory[i].id,count:inventory[i].count,slot:i,inventory:true});
        }
        let itemsBar= playersInfo[socket.nick].itemsBar;
        for(let i=0;i<itemsBar.length;i++)
        {
           socket.emit('updateItem',{id:itemsBar[i].id,count:itemsBar[i].count,slot:i,inventory:false});
        }

    for(let sock of  io.sockets.sockets)
    {
        if(sock[1]!=socket)
        {
           // console.log(sock[1]);
            socket.emit('spawnPlayer',sock[1].pos,sock[1].KOCEid);
        }
    }
    socket.broadcast.emit('spawnPlayer',socket.pos,socket.KOCEid)
    });
    socket.on('moveItem',(data:{slot1:number,isInv1:boolean, slot2:number,isInv2:boolean})=>{
      //  console.log("Moving....");
        console.log(data);
        if(data.isInv1 && data.isInv2)
        {
        //    console.log("Moved item!!");
        let item = playersInfo[socket.nick].inventory[data.slot1];
        playersInfo[socket.nick].inventory[data.slot1] = playersInfo[socket.nick].inventory[data.slot2];
        playersInfo[socket.nick].inventory[data.slot2] = item;
        socket.emit("updateItem",{id: playersInfo[socket.nick].inventory[data.slot2].id,count: playersInfo[socket.nick].inventory[data.slot2].count,slot:data.slot2,inventory:true});
        socket.emit("updateItem",{id: playersInfo[socket.nick].inventory[data.slot1].id,count: playersInfo[socket.nick].inventory[data.slot1].count,slot:data.slot1,inventory:true});   
        } 
        else if(data.isInv1 && !data.isInv2)
        {
            let item = playersInfo[socket.nick].inventory[data.slot1];
            playersInfo[socket.nick].inventory[data.slot1] = playersInfo[socket.nick].itemsBar[data.slot2];
            playersInfo[socket.nick].itemsBar[data.slot2] = item;
            socket.emit("updateItem",{id: playersInfo[socket.nick].itemsBar[data.slot2].id,count: playersInfo[socket.nick].itemsBar[data.slot2].count,slot:data.slot2,inventory:false});
            socket.emit("updateItem",{id: playersInfo[socket.nick].inventory[data.slot1].id,count: playersInfo[socket.nick].inventory[data.slot1].count,slot:data.slot1,inventory:true});
        }
        else if(!data.isInv1 && data.isInv2)
        {
            let item = playersInfo[socket.nick].inventory[data.slot2];
            playersInfo[socket.nick].inventory[data.slot2] = playersInfo[socket.nick].itemsBar[data.slot1];
            playersInfo[socket.nick].itemsBar[data.slot1] = item;
            socket.emit("updateItem",{id: playersInfo[socket.nick].itemsBar[data.slot1].id,count: playersInfo[socket.nick].itemsBar[data.slot1].count,slot:data.slot1,inventory:false});
            socket.emit("updateItem",{id: playersInfo[socket.nick].inventory[data.slot2].id,count: playersInfo[socket.nick].inventory[data.slot2].count,slot:data.slot2,inventory:true});
        }
        else if(!data.isInv1 && !data.isInv2)
        {
            let item = playersInfo[socket.nick].itemsBar[data.slot2];
            playersInfo[socket.nick].itemsBar[data.slot2] = playersInfo[socket.nick].itemsBar[data.slot1];
            playersInfo[socket.nick].itemsBar[data.slot1] = item;
            socket.emit("updateItem",{id: playersInfo[socket.nick].itemsBar[data.slot1].id,count: playersInfo[socket.nick].itemsBar[data.slot1].count,slot:data.slot1,inventory:false});
            socket.emit("updateItem",{id: playersInfo[socket.nick].itemsBar[data.slot2].id,count: playersInfo[socket.nick].itemsBar[data.slot2].count,slot:data.slot2,inventory:false});
        }
        savePlayerInfo();
    });
    socket.on('getSubchunk',(x,y,z)=>{
       // console.log("Subchunk");
       const chunk = getChunk(x,z);
    
        let data =chunk.subchunks[y];
        socket.emit('subchunk', {data:{subX:x,subY:y,subZ:z,blocks:data}})    
    });
        socket.on("playerMove",(pos,rot)=>{
            socket.pos =pos;
            socket.rot=rot;
            socket.broadcast.emit("moveEntity",socket.KOCEid,pos,rot);
        });
    socket.on("placeBlock",(data)=>{
        if(data.id!=0 && playersInfo[socket.nick].itemsBar[data.slot].id != data.id) return;
        if(--playersInfo[socket.nick].itemsBar[data.slot].count<=0)
        {
        playersInfo[socket.nick].itemsBar[data.slot].id=0;
        playersInfo[socket.nick].itemsBar[data.slot].count=0;
        }
        if(data.id!=0)
        socket.emit("updateItem",{id: playersInfo[socket.nick].itemsBar[data.slot].id,count: playersInfo[socket.nick].itemsBar[data.slot].count,slot:data.slot,inventory:false});
     
        savePlayerInfo();
       io.emit("placeBlock",data);
       let inPos ={x:Math.round(Math.round(data.pos.x)%16),y:Math.round(Math.round(data.pos.y)%16),z:Math.round(Math.round(data.pos.z)%16)};
       if(inPos.x<0)
       inPos.x = 16-Math.abs(inPos.x);
   if(inPos.z<0)
       inPos.z = 16-Math.abs(inPos.z);
       if(inPos.y<0)
       inPos.y = 16-Math.abs(inPos.y);
       const subchunkPos = {x:Math.floor(Math.round(data.pos.x)/16),y:Math.floor(Math.round(data.pos.y)/16),z:Math.floor(Math.round(data.pos.z)/16)};
       let chunk = getChunk(subchunkPos.x,subchunkPos.z);
       console.log(subchunkPos.x,subchunkPos.y,subchunkPos.z);
       if(data.id==0)
       socket.emit("spawnEntity",{type:"item",id: chunk.subchunks[subchunkPos.y][toIndex(inPos.x,inPos.y,inPos.z)],pos:data.pos});
     //  let fdata = JSON.parse(fs.readFileSync(__dirname+"/world/"+subchunkPos.x+"."+subchunkPos.y+"."+subchunkPos.z+".sub").toString());
       chunk.subchunks[subchunkPos.y][toIndex(inPos.x,inPos.y,inPos.z)] = data.id;
        saveChunk(chunk);
    });
    socket.on("disconnect", (reason) => {
        socket.broadcast.emit("killEntity",socket.KOCEid);
      });
  });
app.get("*",(req,res)=>{
    //  console.log(rDir+"/Client/index.html");
    if(req.path.includes("favicon"))
    {
        console.log("FAVICON");
        res.sendFile(rDir+"/Client/res/favicon.ico");
        return;
    }
    res.sendFile(rDir+"/Client"+req.path);
});
server.listen(3000,()=>{
    console.log("listening on 3000");
});

function saveChunk(chunk:Chunk)
{
    fs.writeFileSync(__dirname+"/world/"+chunk.pos[0]+"."+chunk.pos[1]+".kChunk",JSON.stringify(chunk.subchunks));
}
function savePlayerInfo()
{ 
    fs.writeFileSync(__dirname+"/players.json",JSON.stringify(playersInfo));

}
function getChunk(x,z)
{
  
    if(loadedChunks.has(x+"-"+z))
      return loadedChunks.get(x+"-"+z)
    if(fs.existsSync(__dirname+"/world/"+x+"."+z+".kChunk"))
    {
    let   chunk = new Chunk();
    chunk.subchunks= JSON.parse(fs.readFileSync(__dirname+"/world/"+x+"."+z+".kChunk").toString());
    chunk.pos=[x,z];
    loadedChunks.set(x+"-"+z,chunk);
    return chunk;
    }
    def:
    {
    let chunk = gen.generate(x,z);
    loadedChunks.set(x+"-"+z,chunk);
    return chunk;
    }
}
export function toIndex(x,y,z)
{
    return x+(y*16)+(z*256);
}