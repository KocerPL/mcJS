import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Shader } from "../../Engine/Shader/Shader.js";
import { Texture } from "../../Engine/Texture.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { Sprite } from "../../Engine/Utils/Sprite.js";
import { GuiComponent } from "./GuiComponent.js";
let gl = CanvaManager.gl;
export class ImgComponent extends GuiComponent
{
    constructor(id:string)
    {
        super(id);
        this.visible =true;
        this.renderMe = true;
        this.transformation = Matrix3.identity();
        this.sprite = new Sprite(-1,-1,1,1);
        this.tcoords = Texture.screenAtlas.coords[Texture.screenAtlas.indexMap.get("titleImage")];
    }
    renderItself(shader: Shader, mat: Matrix3): void {
        Texture.screenAtlas.bind();
        shader.loadMatrix3("transformation",mat);
        if(this.renderMe)
        gl.drawElements(gl.TRIANGLES,this.vEnd-this.vStart,gl.UNSIGNED_INT,this.vStart*4);
    }
}