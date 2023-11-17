import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { ALIGN, TextSprite } from "../../Engine/Utils/TextSprite.js";
const gl =CanvaManager.gl;
export class TextComponent extends GuiComponent
{
    constructor(id:string,text:string,w:number,h?:number,align?:ALIGN,renderFromTop?:boolean)
    {
        super(id);
        this.sprite = new TextSprite(-w,-(h??(w*2)),w,(h??(w*2)),text,align,renderFromTop);
        this.visible =true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.fontAtlas.coords[49];
      
    }
    renderItself(shader: Shader, mat: Matrix3): void {
        Texture.fontAtlas.bind();
        shader.loadMatrix3("transformation",mat);
        shader.loadFloat("transparency",this.transparency);
        if(this.renderMe)
            gl.drawElements(gl.TRIANGLES,this.vEnd-this.vStart,gl.UNSIGNED_INT,this.vStart*4);
    }
    changeText(text:string)
    {
        if(text==""){ this.renderMe = false; return;}
        this.renderMe =true;
        if(this.sprite instanceof TextSprite)
            this.sprite.text = text;
        this.gui.needsRefresh();
    }
    appendText(text:string)
    {
        this.renderMe =true;
        if(this.sprite instanceof TextSprite)
        {
            this.sprite.text+= text;
            if(this.sprite.text==""){ this.renderMe = false; return;}
        }
        this.gui.needsRefresh();
    }
}