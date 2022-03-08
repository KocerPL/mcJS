export class Array3D extends Array
{
    constructor(x:number,y:number,z:number)
    {
        super(x);
        for(let i=0;i<x;i++)
        {
            this[i] = new Array(y);
            for(let j=0;j<y;j++)
            {
                this[i][j] = new Array(z);
            }
        }
    }
}