export interface BoundingBox
{
    x:number;
    y:number;
    dx:number;
    dy:number;
}
export function isIn(x:number,y:number,bb:BoundingBox):boolean
{
    if(x>bb.x && x<bb.dx&&y>bb.y&& y<bb.dy)
        return true;
    return false;
}