import { Model } from "../Game/Models.js";
import { Loader } from "./Loader.js";
export class Texture
{
    static SIZE=64;
    static imageSize = 1024;
    static rowSize = 16;
    static blocksGridTest = Loader.imageArray("./res/textures/Blocks.png",20,16);
    // static GUI = Loader.image("/JS/Engine/Textures/GUI.png");
    static blockOverlay = Loader.imageArray("./res/textures/blockOverlay.png",6,8);
    static skin = Loader.imageArrayByJSON("./res/textures/skinMC.png",Model.player);
    static GUI = Loader.imageAtlasByJSON("./res/textures/GUI.png", Loader.json("./res/textures/GUI.json"),256,256);
    static crossHair = Loader.image("./res/textures/crosshair.png");
    static hammer:WebGLTexture = Loader.image("./res/textures/hammer.png");
    static skinAtlas =  Loader.imageAtlasByJSON("./res/textures/skinMC.png"/*"http://i.imgur.com/PNJXVA3.png"*/,Model.player,64,64);
}
