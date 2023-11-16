import { Texture } from "../../Engine/Texture.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
import { BorderedSprite } from "../../Engine/Utils/BorderedSprite.js";
import { BoundingBox, isIn } from "../../Engine/BoundingBox.js";
import { TextComponent } from "./TextComponent.js";
import { ALIGN, TextSprite } from "../../Engine/Utils/TextSprite.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { TextInput } from "./TextInput.js";
const gl = CanvaManager.gl;
export class InlineTextInput extends GuiComponent
{
    //onclick:Function=()=>{};
    // boundingBox:BoundingBox;
    constructor(id:string,text:string)
    {
        super(id);
        const txt= this.add(new TextInput(id+"_text_in",text,0.03,null,ALIGN.left));
        this.sprite = new Sprite(0,-0.1,1,0.1);
        this.visible =true;
        this.transformation = Matrix3.identity();
        this.tcoords = Texture.GUI.coords[0];
        this.renderMe = false;
        this.boundingBox = {x:-0.475,y:-0.075,dx:0.475,dy:0.075};
       
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