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
    add(vec:Vector3):Vector3
    {
        let outVec = new Vector3();
        outVec.x = this.x+vec.x;
        outVec.y = this.y+vec.y;
        outVec.z = this.z+vec.z;
        return outVec;
    }
    multiply(scalar:number)
    {
        let outVec = new Vector3();
        outVec.x = this.x*scalar;
        outVec.y = this.y*scalar;
        outVec.z = this.z*scalar;
        return outVec
    }
    isIn(x:number,y:number,z:number,dx:number,dy:number,dz:number):boolean
    {
        if(this.x>x && this.y>y && this.z>z && this.x<dx && this.y<dy &&this.z<dz)
        return true;
        return false;
    }
    copy()
    {
        return new Vector3(this.x,this.y,this.z);
    }
}