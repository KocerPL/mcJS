import { Vector3 } from "./Vector3.js";

type bool = 0 | 1;

export class Vector4 extends Vector3
{
    public w;
    constructor(x:number,y:number,z:number,w?:number)
    {
        super(x,y,z);
        this.w=w??1;
    }
    copy()
    {
        return new Vector4(this.x,this.y,this.z,this.w);
    }
    abs():Vector4
    {
        return new Vector4(Math.abs(this.x),Math.abs(this.y),Math.abs(this.z),Math.abs(this.w));
    }
    static add(vecA:Vector4,vecB:Vector4):Vector4
    {
        return new Vector4(vecA.x+vecB.x,vecA.y+vecB.y,vecA.z+vecB.z);
    }
    equals(vec):boolean
    {
        return (vec.x==this.x && vec.y==this.y && vec.z==this.z);
    }
    round()
    {
        return new Vector4(Math.round(this.x),Math.round(this.y),Math.round(this.z));
    }
    mult(scalar:number)
    {
        return new Vector4(this.x*scalar,this.y*scalar,this.z*scalar,this.w*scalar); 
    }
    modulo(mod:number,mask?:{x:bool,y:bool,z:bool})
    {
        mask??={x:1,y:1,z:1};
        return new Vector4(mask.x?this.x%mod:this.x,mask.y?this.y%mod:this.y,mask.z?this.z%mod:this.z);
    }
    static fromData(data:{x:number,y:number,z:number,w?:number}):Vector4
    {
        return new Vector4(data.x,data.y,data.z,data.w??0);
    }
    
}