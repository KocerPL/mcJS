import { CanvaManager } from "../../Engine/CanvaManager.js";
import { RenderArrays } from "../../Engine/RenderArrays.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { Texture } from "../../Engine/Texture.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { rot2d } from "../Models.js";
import { GUI } from "./GUI.js";
import { Button } from "./Button.js";
import { BoundingBox, isIn } from "../../Engine/BoundingBox.js";
import { ItemHolder } from "./ItemHolder.js";

const gl = CanvaManager.gl;
export abstract class GuiComponent
{
    public sprite:Sprite;
    protected components:GuiComponent[]=[];
    renderMe=true;
    boundingBox:BoundingBox =undefined;
    onclick = ():void=>{};
    onkey = (key:string):void=>{};
    onmissclick = ():void=>{};
    protected visible:boolean;
    public transparency=1;
    gui:GUI;
    changed=true;
    id:string;
    vStart=0;
    vEnd=0;
    parent:GuiComponent|null = null;
    transformation:Matrix3;
    tcoords:{x:number,y:number,dx:number,dy:number,rotation: rot2d};
    constructor(id:string)
    {
        this.id =id;
    }
    set setVisible(visible: boolean)
    {
        this.changed = true;
        this.visible = visible;
    }
    get getVisible()
    {
        return this.visible;
    }
    updateComponents(vStart:number):RenderArrays
    {
        let index=0;
        const rArrays = new RenderArrays();
        rArrays.resetArrays();
     
        for(const comp of this.components)
        {
            comp.changed=false;
            const subRArrays  =  comp.updateComponents(vStart+ rArrays.indices.length);
            for(let i =0;i<subRArrays.vertices.length;i+=2)
            {
                //const result:Vector3 = this.transformation.multiplyVec(new Vector3(subRArrays.vertices[i],subRArrays.vertices[i+1],1)); 
                rArrays.vertices.push(subRArrays.vertices[i],subRArrays.vertices[i+1]);
            }
            let highest = 0;
            for(let i=0;i<subRArrays.indices.length;i++)
            {
                if(subRArrays.indices[i]+index>highest) highest = subRArrays.indices[i]+index;
                rArrays.indices.push(subRArrays.indices[i]+index);
            }
            index = highest+1;
            rArrays.textureCoords.push(...subRArrays.textureCoords);
        }
        if(this.renderMe)
        {
            const set = this.sprite.getRenderArrays(this.tcoords);
            this.vStart = vStart+ rArrays.indices.length;
            for(let i =0;i<set.vertices.length;i+=2)
            {
                const result:Vector3 = this.transformation.multiplyVec(new Vector3(set.vertices[i],set.vertices[i+1],1)); 
                rArrays.vertices.push(set.vertices[i],set.vertices[i+1]);
            }
            let highest = 0;
            for(let i=0;i<set.indices.length;i++)
            {
                if(set.indices[i]+index>highest) highest = set.indices[i]+index;
                rArrays.indices.push(set.indices[i]+index);
            }
            this.vEnd = vStart+ rArrays.indices.length;
            index = highest+1;
            rArrays.textureCoords.push(...set.textureCoords);
        }
        // console.log(this.id,"=", this.vStart,"|||",this.vEnd);
        return rArrays;
    }
    add(component:GuiComponent):GuiComponent
    {
        this.components.push(component);
        component.attachGUI(this.gui);
        if(this.gui)
            this.gui.needsRefresh();
        component.parent =this;
        return component;
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
    render(shader:Shader,transf:Matrix3)
    {
        if(!this.visible) return;
        const mat = transf.multiplyMat(this.transformation);//.multiplyMat(transf);
        this.renderItself(shader,mat);
        for(const comp of this.components)
            comp.render(shader,mat);
       
      
    }
    onKey(key:string)
    {
        if(!this.visible) return;
        for(const comp of this.components)
            comp.onKey(key);
        this.onkey(key);
    }
    onClick(x:number,y:number)
    {
        //  console.log("propagating onclick");
        if(!this.visible) return;
        const v = this.transformation.inverse().multiplyVec(new Vector3(x,y,1));
        for(const comp of this.components)
            comp.onClick(v.x,v.y);
        
        if(this.boundingBox&& isIn(v.x,v.y,this.boundingBox))
            this.onclick();
        else 
            this.onmissclick();
    }
    attachGUI(gui:GUI)
    {
        this.gui = gui;
        for(const comp of this.components)
            comp.attachGUI(gui);
    }
    renderItself(shader:Shader,mat:Matrix3)
    {
        Texture.GUI.bind();  
        shader.loadMatrix3("transformation",mat);
        shader.loadFloat("transparency",this.transparency);
        if(this.renderMe)
            gl.drawElements(gl.TRIANGLES,this.vEnd-this.vStart,gl.UNSIGNED_INT,this.vStart*4);
    }
}