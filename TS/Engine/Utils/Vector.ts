export class Vector
{
    public x;
    public y;
    public z;
    public w;
    constructor(x:Number,y:Number,z:Number,w?:Number)
    {
        this.x=x;
        this.y=y;
        this.z=z;
        this.w=w??1;
    }
    copy()
    {
        return new Vector(this.x,this.y,this.z,this.w);
    }
    abs():Vector
    {
        return new Vector(Math.abs(this.x),Math.abs(this.y),Math.abs(this.z));
    }
    static add(vecA:Vector,vecB:Vector):Vector
    {
        return new Vector(vecA.x+vecB.x,vecA.y+vecB.y,vecA.z+vecB.z);
    }
    equals(vec):boolean
    {
        return (vec.x==this.x && vec.y==this.y && vec.z==this.z);
    }
    round()
    {
        return new Vector(Math.round(this.x),Math.round(this.y),Math.round(this.z));
    }
    mult(scalar)
    {
        return new Vector(this.x*scalar,this.y*scalar,this.z*scalar); 
    }
}