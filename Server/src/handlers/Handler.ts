import { NetworkHandler } from "../NetworkHandler";

export abstract class Handler
{
    constructor(netHandler:NetworkHandler,trigger:string)
    {
        this.trigger = trigger;
        netHandler.register(this);
    }
    trigger:string;
    abstract handle(ev):void;

}