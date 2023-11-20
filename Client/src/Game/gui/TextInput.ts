import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { ALIGN, TextSprite } from "../../Engine/Utils/TextSprite.js";
import { Vector4 } from "../../Engine/Utils/Vector4.js";
const gl =CanvaManager.gl;
export class TextInput extends GuiComponent
{
    text:string;
    time=0;
    public selected=true;
    public background:Vector4 = new Vector4(0,0,0,0);
    public cursor=false;
    constructor(id:string,text:string,w:number,h?:number,align?:ALIGN)
    {
        super(id);
        this.sprite = new TextSprite(-w,-(h??(w*2)),w,(h??(w*2)),text,align);
        this.text = text;
        this.visible =true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.fontAtlas.coords[49];
        this.changeText(this.text);
        this.onkey= (key)=>{
           
            if(!this.selected) return;
            if(key.length==1)
                this.text+=key;
            else if(key=="Backspace")
                this.text=  this.text.substring(0,this.text.length-1);
            this.changeText(this.text);
        };
       
    }
    renderItself(shader: Shader, mat: Matrix3): void {
        Texture.fontAtlas.bind();
    
        if(this.selected)
        {
            const now = Date.now();
            if(now-this.time> 500) {
                this.time=now;
                if(this.sprite instanceof TextSprite)
                    if(this.cursor)
                        this.sprite.text = this.text+"_";
                    else
                        this.sprite.text = this.text+" ";
                this.cursor=!this.cursor;
                this.gui.needsRefresh();
            }
        }
        shader.loadMatrix3("transformation",mat);
        shader.loadFloat("transparency",this.transparency);
        shader.loadVec4("bgColor",this.background);
        if(this.renderMe)
            gl.drawElements(gl.TRIANGLES,this.vEnd-this.vStart,gl.UNSIGNED_INT,this.vStart*4);
        shader.loadVec4("bgColor",new Vector4(0,0,0,0));
    }
    getText()
    {
        return this.text;
    }
    changeText(text:string)
    {
        //  if(text==""){ this.renderMe = false; return;}
       
        this.text = text;
        
        this.renderMe =true;
        if(this.sprite instanceof TextSprite)
            this.sprite.text = text+" ";
        if(this.gui)
            this.gui.needsRefresh();
    }
}