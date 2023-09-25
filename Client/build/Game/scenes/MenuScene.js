import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Scene } from "../../Engine/Scene.js";
import { ALIGN } from "../../Engine/Utils/TextSprite.js";
import { Main } from "../../Main.js";
import { GUI } from "../gui/GUI.js";
import { TextComponent } from "../gui/TextComponent.js";
let gl = CanvaManager.gl;
export class MenuScene extends Scene {
    start() {
        this.gui = new GUI(Main.shader2d);
        let txt = new TextComponent("title", "Mine-but-dont-craft", 0.1, 0.2, ALIGN.center);
        this.gui.add(txt);
        txt.transformation = txt.transformation.translate(0.0, 0.8);
        // throw new Error("Method not implemented.");
    }
    update() {
        //throw new Error("Method not implemented.");
    }
    render() {
        this.gui.render();
        gl.clearColor(0, 0, 0, 1.0);
    }
}
