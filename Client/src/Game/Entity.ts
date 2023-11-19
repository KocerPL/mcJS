import { RenderSet } from "../Engine/RenderSet.js";
import { AtlasShader } from "../Engine/Shader/AtlasShader.js";
import { Matrix4 } from "../Engine/Utils/Matrix4.js";
import { Vector4 } from "../Engine/Utils/Vector4.js";
export abstract class Entity
{
    private transitions:Array<{pos:Vector4}> = [];
    protected transformation:Matrix4 = Matrix4.identity();
    public pos:Vector4;
    protected rs:RenderSet;
    private uuid;
    
    constructor(pos:Vector4,shad:AtlasShader,uuid:number)
    {
        this.rs = new RenderSet(shad);
        this.uuid = uuid;
        this.pos = pos.copy();
    }
    public get UUID()
    {
        return this.uuid;
    }
    protected updatePosBOT() // Based on transition
    {
        const nTransition = this.transitions.shift();
        if(nTransition!=undefined)
        {
            this.pos=nTransition.pos;
        }
    }
    abstract  update(i:number):void 
  abstract  render():void;
  addNextTransitions(nextPos:Vector4,count:number)
  {
      const deltaPos = Vector4.add(nextPos,this.transitions.length>0?this.transitions.at(-1).pos.mult(-1):this.pos.mult(-1));
      const OneStepPos = deltaPos.mult(1/count);
      for(let i=1;i<count;i++)
      {
          this.transitions.push({pos:Vector4.add(this.transitions.length>0?this.transitions.at(-1).pos:this.pos,OneStepPos.mult(i))});
      }
      this.transitions.push({pos:nextPos});
   
  }
}