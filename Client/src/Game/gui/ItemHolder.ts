import { CanvaManager } from "../../Engine/CanvaManager";
import { Shader } from "../../Engine/Shader/Shader.js";
import { Texture } from "../../Engine/Texture";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { GuiComponent } from "./GuiComponent.js";
const gl =CanvaManager.gl;
export class ItemHolder extends GuiComponent
{
    render(shader:Shader,transf:Matrix3)
    {

       gl.bindTexture(gl.TEXTURE_2D,Texture.blocksGridTest);
        let mat = transf.multiplyMat(this.transformation);//.multiplyMat(transf);
           shader.loadMatrix3("transformation",mat);
        for(const comp of this.components)
        comp.render(shader,mat);
    if(this.renderMe)
        gl.drawElements(gl.TRIANGLES,this.vEnd-this.vStart,gl.UNSIGNED_INT,this.vStart*4);
    }
}