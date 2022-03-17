import { SubChunk } from "../Game/SubChunk.js";

export class Task 
{
    func:Function;
    caller;
    label:string
    constructor(func:Function ,calledBy,label?:string )
    {
        this.func =func;
        this.caller = calledBy;
        this.label = label;
    }
}