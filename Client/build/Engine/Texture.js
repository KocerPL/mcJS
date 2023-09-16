import { Model } from "../Game/Models.js";
import { Loader } from "./Loader.js";
class Texture {
    static SIZE = 64;
    static imageSize = 1024;
    static rowSize = 16;
    static blocksGridTest = Loader.imageArray("./res/textures/Blocks.png", 20, 16);
    // static GUI = Loader.image("/JS/Engine/Textures/GUI.png");
    static blockAtlas = Loader.imageAtlasByJSON("./res/textures/Blocks.png", Loader.json("./res/textures/Blocks.json"), 1024, 1024);
    static blockOverlay = Loader.imageAtlasByJSON("./res/textures/blockOverlay.png", Loader.json("./res/textures/blockOverlay.json"), 64, 64);
    static GUI = Loader.imageAtlasByJSON("./res/textures/GUI.png", Loader.json("./res/textures/GUI.json"), 256, 256);
    static crossHair = Loader.image("./res/textures/crosshair.png");
    static hammer = Loader.image("./res/textures/hammer.png");
    static skinAtlas = Loader.imageAtlasByJSON("./res/textures/skinMC.png" /*"http://i.imgur.com/PNJXVA3.png"*/, Model.player, 64, 64);
}
export { Texture };
