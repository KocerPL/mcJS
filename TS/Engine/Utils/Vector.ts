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
}