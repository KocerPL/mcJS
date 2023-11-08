
import fs = require('fs');
import { Chunk } from "./World/Chunk";
import { Generator } from "./World/Generator";
import { randRange } from "./Utils";
import { Entity } from "./Entities/Entity";
import { Item } from "./Entities/Item";
import { World } from "./World/World";
import { EntityManager } from "./managers/EntityManager";
import { NetworkListener, NetworkManager } from './managers/NetworkManager';
import { Socket } from 'socket.io';
import { Player, PlayerManager } from './managers/PlayerManager';
import { Vector3 } from './Utils/Vector3';
let lastID=0;
let counter =0;
const defaultSpawnPoint = new Vector3(0,100,0);
function backOne(path:string)
{
    if(path.at(-1)=="/")
    path =path.substring(0,path.length-1);
    while(path.at(-1)!="/" && path.length>0)
        path = path.substring(0,path.length-1) 
        path =path.substring(0,path.length-1);
    return path;
}
export const paths = Object.freeze({
    res: backOne(__dirname)+"/res",
    world:  backOne(__dirname)+"/res/world",
    client: backOne(backOne(__dirname))+"/Client",
    main:  backOne(backOne(__dirname))
});





export type UUID = number;
export function getUUID():UUID
{
    return Number.parseInt(Date.now().toString() +(counter++).toString());
}

export class Main
{
    static world:World = new World(paths.world);
  
    static gen = new Generator();
    static networkManager = new NetworkManager(3000);
    static entityManager = new EntityManager();
    static playerManager = new PlayerManager();
  //  static playersInfo =
    static onConnection(socket:Socket)
    {
       // console.log(socket);
       
            //console.log('a user connected');
        
           // socket.KOCEid = lastID++;
            socket.on("login",(loginObject)=>
            {
            const player = new Player(loginObject.nick,socket,getUUID());
            this.playerManager.add(player);
            socket.emit('login',{x:0,y:200,z:0}, player.uuid);
          // console.log(io.sockets);
                
                let inventory = player.inventory;
                for(let i=0;i<inventory.length;i++)
                {
                   socket.emit('updateItem',{id:inventory[i].id,count:inventory[i].count,slot:i,inventory:true});
                }
                let itemsBar= player.itemsBar;
                for(let i=0;i<itemsBar.length;i++)
                {
                   socket.emit('updateItem',{id:itemsBar[i].id,count:itemsBar[i].count,slot:i,inventory:false});
                }
            player.pos = defaultSpawnPoint.copy();
            for(let sock of  this.networkManager.getSockets())
            {
                if(sock[1]!=socket)
                {
                   // console.log(sock[1]);
                    socket.emit('spawnPlayer',player.pos,player.uuid);
                }
            }
            socket.broadcast.emit('spawnPlayer',player.pos,player.uuid)
            });
           
    }
    static run()
    {
        console.log( paths.res);
this.networkManager.addListener(new NetworkListener('connection',this.onConnection.bind(this))) ;


    }

}
Main.run();