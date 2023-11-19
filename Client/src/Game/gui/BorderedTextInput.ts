import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { BorderedSprite } from "../../Engine/Utils/BorderedSprite.js";
import { TextComponent } from "./TextComponent.js";
import { ALIGN, TextSprite } from "../../Engine/Utils/TextSprite.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { TextInput } from "./TextInput.js";
const gl = CanvaManager.gl;
export class BorderedTextInput extends GuiComponent
{
    //onclick:Function=()=>{};
    // boundingBox:BoundingBox;
    constructor(id:string,text:string)
    {
        super(id);
        const txt= this.add(new TextInput(id+"_text_in",text,0.03,null,ALIGN.center));
        this.sprite = new BorderedSprite(-0.475,-0.075,0.475,0.075,0.025,Texture.GUI.coords[3],Texture.GUI.coords[4],Texture.GUI.coords[5],Texture.GUI.coords[6],Texture.GUI.coords[7],Texture.GUI.coords[8],Texture.GUI.coords[9],Texture.GUI.coords[10],Texture.GUI.coords[11]);
        this.visible =true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.GUI.coords[0];
        this.boundingBox = {x:-0.475,y:-0.075,dx:0.475,dy:0.075};
        if(txt instanceof TextInput)
        {
            this.onclick =()=>{
                txt.selected = true;
            };
            this.onmissclick =()=>{
                txt.selected = false;
                if(txt.sprite instanceof TextSprite)
                    txt.sprite.text = txt.text+" ";
                this.gui.needsRefresh();
            };
        }
    }
    changeText(text:string)
    {
        const t=  this.get(this.id+"_text_in");
        if(t instanceof TextComponent)
            t.changeText(text);
    }
    renderItself(shader:Shader,mat:Matrix3)
    {
        Texture.GUI.bind(); 
         
        //const v = this.transformation.inverse().multiplyVec(new Vector3(CanvaManager.mouse.pos.x,CanvaManager.mouse.pos.y,1));
        /*if(isIn(v.x,v.y,this.boundingBox))
            shader.loadMatrix3("transformation",mat.scale(1.2,1.2));
        else*/
        shader.loadMatrix3("transformation",mat);
        if(this.renderMe)
            gl.drawElements(gl.TRIANGLES,this.vEnd-this.vStart,gl.UNSIGNED_INT,this.vStart*4);
    }
}