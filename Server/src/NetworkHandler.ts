import { Server, Socket } from "socket.io";
import { Handler } from "./handlers/Handler";

export class NetworkHandler
{
    io:Server;
    constructor(io:Server)
    {
        this.io=io;
    }
    register(handler:Handler)
    {
        this.io.on(handler.trigger,(ev)=>{
            handler.handle(ev);
        })
    }
}