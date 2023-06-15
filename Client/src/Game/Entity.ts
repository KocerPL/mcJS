import { RenderSet } from "../Engine/RenderSet.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { Vector } from "../Engine/Utils/Vector.js";

export abstract class Entity
{
    protected transformation:Matrix = Matrix.identity();
    public pos:Vector;
    protected rs:RenderSet = new RenderSet();
    private id;
    constructor(pos:Vector,id?)
    {
        this.id = id;
        this.pos = pos.copy();
    }
    public get ID()
    {
        return this.id;
    }
  abstract  update(i:number):void 
  abstract  render():void 
}