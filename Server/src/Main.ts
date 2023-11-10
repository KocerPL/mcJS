
import fs = require('fs');
import { Generator } from "./World/Generator";
import { World } from "./World/World";
import { EntityManager } from "./managers/EntityManager";
import { NetworkListener, NetworkManager } from './managers/NetworkManager';
import { Socket } from 'socket.io';
import { Player, PlayerManager } from './managers/PlayerManager';
import { Vector3 } from './Utils/Vector3';
let lastID=0;
let counter =0;
export const defaultSpawnPoint = new Vector3(0,100,0);
function backOne(path:string)
{
    if(path.at(-1)=="/")
    path =path.substring(0,path.length-1);
    while((path.at(-1)!="\\" && path.at(-1)!="/") && path.length>0)
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
                if(this.playerManager.existName(loginObject.nick))
                {
                    socket.emit('loginFailed',"Player is already in game, please use other nick");
                    return;
                }
            const player = new Player(loginObject.nick,socket,getUUID());
            
            this.playerManager.add(player);
            console.log(player.pos);
            socket.emit('login',JSON.stringify(player.pos), player.uuid);
         console.log(player.name + " logged in");
                
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
            //player.pos = defaultSpawnPoint.copy();
            for(let pl of this.playerManager.players)
            {
                if(pl[1].name!=player.name)
                {
                   // console.log(sock[1]);
                    socket.emit('spawnPlayer',pl[1].pos,pl[1].uuid);
                }
            }
            socket.broadcast.emit('spawnPlayer',player.pos,player.uuid)
            });
           
    }
    static run()
    {
        this.networkManager.addListener(new NetworkListener('connection',this.onConnection.bind(this))) ;

        setInterval(this.update.bind(this),50);
    }
    static update()
    {
        this.playerManager.update();
    }

}
Main.run();