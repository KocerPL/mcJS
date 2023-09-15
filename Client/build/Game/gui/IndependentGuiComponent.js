import { Vector3 } from "../../Engine/Utils/Vector3.js";
import { GuiComponent } from "./GuiComponent.js";
export class IndependentGuiComponent extends GuiComponent {
    renderMe = false;
    vao;
    vbo;
    tbo;
    render() {
        super.render();
        let par = this.parent;
        let translation = new Vector3(0, 0, 0);
        while (par) {
            translation = par.transformation.multiplyVec(translation);
            par = par.parent;
        }
        let mat = this.transformation.translate(translation.x, translation.y);
    }
}
