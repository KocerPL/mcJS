import { RenderSet } from "../Engine/RenderSet.js";
import { AtlasShader } from "../Engine/Shader/AtlasShader.js";
import { Matrix4 } from "../Engine/Utils/Matrix4.js";
import { Vector } from "../Engine/Utils/Vector.js";

export abstract class Entity
{
    protected transformation:Matrix4 = Matrix4.identity();
    public pos:Vector;
    protected rs:RenderSet;
    private id;
    constructor(pos:Vector,shad:AtlasShader,id?)
    {
        this.rs = new RenderSet(shad);
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