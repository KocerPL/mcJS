import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture2 } from "../../Engine/Loader.js";
import { RenderSet } from "../../Engine/RenderSet.js";
import { Shader2d } from "../../Engine/Shader/Shader2d.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
const gl =CanvaManager.gl;

export class GUI
{
    components:GuiComponent[]=[];
    renderSet:RenderSet;
    constructor(shader:Shader2d)
    {
        this.renderSet=new RenderSet(shader);
    }
    render()
    {
        Texture.GUI.bind();
        this.renderSet.shader.use();
        this.renderSet.vao.bind();
        this.renderSet.shader.loadUniforms(CanvaManager.getProportion,Matrix3.identity());
        for(const comp of this.components)
        {
           comp.render(this.renderSet.shader,Matrix3.identity());
        }
      
     //   gl.drawElements(gl.TRIANGLES,this.renderSet.count,gl.UNSIGNED_INT,0);
    }
    add(component:GuiComponent)
    {
        this.components.push(component);
        this.refresh();
    }
    refresh()
    {
        let index=0;
        this.renderSet.resetArrays();
        for(const comp of this.components)
        {
            if(!comp.getVisible) continue;
           
            let highest = 0;
            comp.updateComponents(this.renderSet.indices.length);
            this.renderSet.vertices.push(...comp.rArrays.vertices);
            for(let i=0;i<comp.rArrays.indices.length;i++)
            {
                if(comp.rArrays.indices[i]+index>highest) highest = comp.rArrays.indices[i]+index;
                this.renderSet.indices.push(comp.rArrays.indices[i]+index);
            }
            index = highest+1;
            this.renderSet.textureCoords.push(...comp.rArrays.textureCoords);
        }
        this.renderSet.bufferArrays();
        console.log(this.renderSet.vertices);
    }
    get(id:string):GuiComponent|null
    {
        for(const comp of this.components)
            if(comp.id==id) return comp; else 
            {
                const test = comp.get(id);
                if(test)
                    return test;
            }
    }
}