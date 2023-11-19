export class Vector3
{
    x:number;
    y:number;
    z:number;
    constructor(x?:number,y?:number,z?:number)
    {
        this.x = x;
        this.y =y;
        this.z = z;
    }
    abs():Vector3
    {
        return new Vector3(Math.abs(this.x),Math.abs(this.y),Math.abs(this.z));
    }
    add(vec:Vector3):Vector3
    {
        const outVec = new Vector3();
        outVec.x = this.x+vec.x;
        outVec.y = this.y+vec.y;
        outVec.z = this.z+vec.z;
        return outVec;
    }
    multiply(scalar:number)
    {
        const outVec = new Vector3();
        outVec.x = this.x*scalar;
        outVec.y = this.y*scalar;
        outVec.z = this.z*scalar;
        return outVec;
    }
    mult(scalar:number)
    {
        const outVec = new Vector3();
        outVec.x = this.x*scalar;
        outVec.y = this.y*scalar;
        outVec.z = this.z*scalar;
        return outVec;
    }
    copy()
    {
        return new Vector3(this.x,this.y,this.z);
    }
    static distance(vecA:Vector3,vecB:Vector3):number
    {
        return Math.sqrt(Math.pow(vecA.x-vecB.x,2)+Math.pow(vecA.y-vecB.y,2)+Math.pow(vecA.z-vecB.z,2));
    }
}