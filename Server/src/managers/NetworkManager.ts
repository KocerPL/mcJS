import express = require("express");
import http = require("http");
import { Server } from "socket.io";
import { paths } from "../Main";
export  class NetworkListener
{
    private event:string;
    private action:(...args: any[]) => void;
    constructor(event:string,action:(...args: any[]) => void)
    {
        this.event =event;
        console.log(action);
        this.execute = (...args)=>{ action(...args)};
        console.log(this.action);
    }
    get getEvent()
    {
        return this.event;
    }
     execute(...args: any[]):void
     {
        console.log("Not overriden!!!");
     }
    
}
export class NetworkManager
{
    app = express();
    server =http.createServer(this.app);
     io:Server = new Server(this.server);
     listeners:Set<NetworkListener>=new Set();
     constructor(port:number)
     {
        this.app.get("/",(req,res)=>{
            res.sendFile(paths.client+"/index.html");
        });
        this.app.get("*",(req,res)=>{
            //  console.log(rDir+"/Client/index.html");
            if(req.path.includes("favicon"))
            {
                console.log("FAVICON");
                res.sendFile(paths.client+"/res/favicon.ico");
                return;
            }
            res.sendFile(paths.client+req.path);
        });
        this.server.listen(port,()=>{
            console.log("listening on "+port);
        });
     }
    addListener(listener:NetworkListener)
    {
        this.listeners.add(listener);
        this.io.on(listener.getEvent,listener.execute);
    }
    removeListener(listener:NetworkListener)
    {
        this.listeners.delete(listener);
        this.io.off(listener.getEvent,listener.execute);
    }
    getSockets()
    {
        return this.io.sockets.sockets;
    }
}