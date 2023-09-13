import { CanvaManager } from "../../Engine/CanvaManager.js";
import { RenderSet } from "../../Engine/RenderSet.js";
import { Shader2d } from "../../Engine/Shader/Shader2d.js";
import { GuiComponent } from "./GuiComponent.js";
const gl =CanvaManager.gl;

export class GUI
{
    components:GuiComponent[]=[];
    renderSet:RenderSet;
    shader:Shader2d;
    constructor(shader:Shader2d)
    {
        this.shader= shader;
        this.renderSet=new RenderSet(shader);
    }
    render()
    {
        for(const comp of this.components)
        {
            if(comp.visible && comp.changed)
                this.refresh();
        }
        this.shader.use();
    }
    add(component:GuiComponent)
    {
        this.components.push(component);
    }
    refresh()
    {
        for(const comp of this.components)
        {
            comp.changed=false;
            if(!comp.visible) continue;
            this.renderSet.vertices.push(...comp.vertices);
            this.renderSet.indices.push(...comp.indices);
            this.renderSet.textureCoords.push(...comp.textureCoords);
        }
    }
}