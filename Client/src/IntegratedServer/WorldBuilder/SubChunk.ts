import { Vector } from "../../Engine/Utils/Vector";

export class SubChunk
{
    pos:Vector;
    blocks:Array<number> = []; // x = %16 y = /16 z= /256
    lightMap:Array<number> = [];
    constructor(pos:Vector)
    {
        this.pos=pos;
    }
}