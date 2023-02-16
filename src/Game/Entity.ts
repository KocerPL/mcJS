import { RenderSet } from "../Engine/RenderSet.js";
import { Matrix } from "../Engine/Utils/Matrix.js";
import { Vector } from "../Engine/Utils/Vector.js";

export abstract class Entity
{
    protected transformation:Matrix = Matrix.identity();
    public pos:Vector;
    protected rs:RenderSet = new RenderSet();
    constructor(pos:Vector)
    {
        this.pos = pos.copy();
    }
  abstract  update(i:number):void 
  abstract  render():void 
}