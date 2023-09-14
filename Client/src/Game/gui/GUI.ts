import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Texture2 } from "../../Engine/Loader.js";
import { RenderSet } from "../../Engine/RenderSet.js";
import { Shader2d } from "../../Engine/Shader/Shader2d.js";
import { Texture } from "../../Engine/Texture.js";
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
        for(const comp of this.components)
        {
            if( comp.changed)
                this.refresh();
        }
        Texture.GUI.bind();
        this.renderSet.shader.use();
        this.renderSet.vao.bind();
        this.renderSet.shader.loadUniforms(CanvaManager.getProportion);
        gl.drawElements(gl.TRIANGLES,this.renderSet.count,gl.UNSIGNED_INT,0);
    }
    add(component:GuiComponent)
    {
        this.components.push(component);
    }
    refresh()
    {
        let index=0;
        this.renderSet.resetArrays();
        for(const comp of this.components)
        {
            comp.changed=false;
            if(!comp.getVisible) continue;
            this.renderSet.vertices.push(...comp.rArrays.vertices);
            let highest = 0;
            for(let i=0;i<comp.rArrays.indices.length;i++)
            {
                if(comp.rArrays.indices[i]+index>highest) highest = comp.rArrays.indices[i]+index;
            this.renderSet.indices.push(comp.rArrays.indices[i]+index);
            }
            index = highest+1;
            this.renderSet.textureCoords.push(...comp.rArrays.textureCoords);
        }
        console.log(this.renderSet.indices);
        console.log(this.renderSet.vertices);
        console.log(this.renderSet.textureCoords);
        this.renderSet.bufferArrays();
        console.log(this.renderSet.count);
    }
}