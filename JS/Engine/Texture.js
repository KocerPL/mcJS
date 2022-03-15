import { Model } from "../Game/Models.js";
import { Loader } from "./Loader.js";
export class Texture {
    static SIZE = 64;
    static imageSize = 1024;
    static rowSize = 16;
    static blocksGrid = Loader.image("/JS/Engine/Textures/Blocks.png");
    static blocksGridTest = Loader.imageArray("/JS/Engine/Textures/Blocks.png", 20, 16);
    // static GUI = Loader.image("/JS/Engine/Textures/GUI.png");
    static blockOverlay = Loader.imageArray("/JS/Engine/Textures/blockOverlay.png", 6, 8);
    static skin = Loader.imageArrayByJSON("/JS/Engine/Textures/skinMC.png", Model.player);
    static GUItest = Loader.imageArray("/JS/Engine/Textures/GUI.png", 3, 9);
    static crossHair = Loader.image("/JS/Engine/Textures/crosshair.png");
    x;
    y;
    dx;
    dy;
    constructor(x, y) {
        this.x = 1 / (Texture.SIZE * x);
        this.y = 1 / (Texture.SIZE * y);
        this.dx = 1 / ((Texture.SIZE * x) + Texture.SIZE);
        this.dy = 1 / ((Texture.SIZE * y) + Texture.SIZE);
    }
}
