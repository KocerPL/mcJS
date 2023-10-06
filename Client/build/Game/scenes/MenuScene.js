import { CanvaManager } from "../../Engine/CanvaManager.js";
import { Scene } from "../../Engine/Scene.js";
import { randRange } from "../../Engine/Utils/Math.js";
import { Matrix3 } from "../../Engine/Utils/Matrix3.js";
import { ALIGN } from "../../Engine/Utils/TextSprite.js";
import { Main } from "../../Main.js";
import { Button } from "../gui/Button.js";
import { GUI } from "../gui/GUI.js";
import { ImgComponent } from "../gui/ImgComponent.js";
import { TextComponent } from "../gui/TextComponent.js";
import { GameScene } from "./GameScene.js";
const gl = CanvaManager.gl;
export class MenuScene extends Scene {
    start() {
        this.gui = new GUI(Main.shader2d);
        this.gui.add(new ImgComponent("titleImage"));
        const txt = new TextComponent("title", "MemeButDontCraft", 0.05, null, ALIGN.center);
        this.gui.add(txt);
        const but = new Button("Test");
        but.transformation = but.transformation.rotate(0.5).translate(0.5, 0.0);
        this.gui.add(but);
        this.gui.add(new TextComponent("author", "Copyleft Kocer BA. Do distribute!", 0.01, null, ALIGN.right)).transformation = Matrix3.identity().translate(1.0, -0.98);
        this.gui.add(new TextComponent("version", "MemeButDontCraft ahplA 0.1", 0.01, null, ALIGN.left)).transformation = Matrix3.identity().translate(-1.0, -0.98);
        but.onclick = () => {
            //console.log("Clicked button");
            Main.changeScene(new GameScene());
        };
        but.changeText("Play");
        txt.transformation = txt.transformation.translate(0.0, 0.8);
        // throw new Error("Method not implemented.");
    }
    update() {
        //throw new Error("Method not implemented.");
    }
    onClick(x, y) {
        console.log("works");
        this.gui.onClick(x, y);
        //  Main.changeScene(new GameScene());
    }
    render() {
        this.gui.get("titleImage").transformation = Matrix3.identity().translate(randRange(-0.1, 0.1), randRange(-0.1, 0.1));
        this.gui.render();
        gl.clearColor(0, 0, 0, 1.0);
    }
}
