import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { ALIGN, TextSprite } from "../../Engine/Utils/TextSprite.js";
import { Vector4 } from "../../Engine/Utils/Vector4.js";
const gl =CanvaManager.gl;
export class TextComponent extends GuiComponent
{
    background:Vector4 = new Vector4(0.0,0.0,0.0,0.0);
    lineBreakLimit = Number.POSITIVE_INFINITY;
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
        shader.loadVec4("bgColor",this.background);
        shader.loadMatrix3("transformation",mat);
        shader.loadFloat("transparency",this.transparency);
        if(this.renderMe)
            gl.drawElements(gl.TRIANGLES,this.vEnd-this.vStart,gl.UNSIGNED_INT,this.vStart*4);
        shader.loadVec4("bgColor",new Vector4(0,0,0,0));
        shader.loadFloat("transparency",1);
    }
    changeText(text:string)
    {
        if(this.sprite instanceof TextSprite)
        {
            this.sprite.text = text;
            let lbCount =0;
            for(let i=this.sprite.text.length-1;i>=0; i--)
            {
                const char = this.sprite.text[i];
                if(char=="\n")
                {
                    lbCount++;
                    if(lbCount>this.lineBreakLimit)
                    {
                        this.sprite.text=this.sprite.text.slice(i);
                        break;
                    }
                }
            }
        }
        this.gui.needsRefresh();
    }
    appendText(text:string)
    {
        if(this.sprite instanceof TextSprite)
        {
            this.sprite.text+= text;
            let lbCount =0;
            for(let i=this.sprite.text.length-1;i>=0; i--)
            {
                const char = this.sprite.text[i];
              
                if(char=="\n")
                {
                    lbCount++;
                    if(lbCount>this.lineBreakLimit)
                        this.sprite.text=this.sprite.text.slice(i);
                    
                }
            }
        }

       
        this.gui.needsRefresh();
    }
}