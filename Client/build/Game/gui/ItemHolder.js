import { CanvaManager } from "../../Engine/CanvaManager";
import { Texture } from "../../Engine/Texture";
import { GuiComponent } from "./GuiComponent.js";
const gl = CanvaManager.gl;
export class ItemHolder extends GuiComponent {
    render(shader, transf) {
        gl.bindTexture(gl.TEXTURE_2D, Texture.blocksGridTest);
        let mat = transf.multiplyMat(this.transformation); //.multiplyMat(transf);
        shader.loadMatrix3("transformation", mat);
        for (const comp of this.components)
            comp.render(shader, mat);
        if (this.renderMe)
            gl.drawElements(gl.TRIANGLES, this.vEnd - this.vStart, gl.UNSIGNED_INT, this.vStart * 4);
    }
}
