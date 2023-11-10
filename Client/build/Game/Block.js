import { Texture } from "../Engine/Texture.js";
import { Vector } from "../Engine/Utils/Vector.js";
export var blockType;
(function (blockType) {
    blockType[blockType["FULL"] = 0] = "FULL";
    blockType[blockType["NOTFULL"] = 1] = "NOTFULL";
    blockType[blockType["EMPTY"] = 2] = "EMPTY";
})(blockType || (blockType = {}));
export class Block {
    id;
    lightFBlock = 0;
    skyLight = 0;
    constructor(id) {
        this.id = id;
    }
    static createInfoArray() {
        Block.info =
            [{
                    name: "Air",
                    type: blockType.EMPTY
                },
                {
                    name: "Dirt",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("dirt")
                    ],
                    breakTime: 2
                },
                {
                    name: "Grass",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("grassTop"),
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("grassSide"),
                        Texture.testAtkas.indexMap.get("grassSide"),
                        Texture.testAtkas.indexMap.get("grassSide"),
                        Texture.testAtkas.indexMap.get("grassSide")
                    ],
                    breakTime: 2
                },
                {
                    name: "Stone",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("stone"),
                        Texture.testAtkas.indexMap.get("stone"),
                        Texture.testAtkas.indexMap.get("stone"),
                        Texture.testAtkas.indexMap.get("stone"),
                        Texture.testAtkas.indexMap.get("stone"),
                        Texture.testAtkas.indexMap.get("stone")
                    ],
                    breakTime: 20
                },
                {
                    name: "Greenstone ore",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("greenstone"),
                        Texture.testAtkas.indexMap.get("greenstone"),
                        Texture.testAtkas.indexMap.get("greenstone"),
                        Texture.testAtkas.indexMap.get("greenstone"),
                        Texture.testAtkas.indexMap.get("greenstone"),
                        Texture.testAtkas.indexMap.get("greenstone")
                    ],
                    breakTime: 20
                },
                {
                    name: "Greenstone block",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("greenstoneBlock"),
                        Texture.testAtkas.indexMap.get("greenstoneBlock"),
                        Texture.testAtkas.indexMap.get("greenstoneBlock"),
                        Texture.testAtkas.indexMap.get("greenstoneBlock"),
                        Texture.testAtkas.indexMap.get("greenstoneBlock"),
                        Texture.testAtkas.indexMap.get("greenstoneBlock")
                    ],
                    breakTime: 10
                },
                {
                    name: "log",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("logTop"),
                        Texture.testAtkas.indexMap.get("logTop"),
                        Texture.testAtkas.indexMap.get("logSide"),
                        Texture.testAtkas.indexMap.get("logSide"),
                        Texture.testAtkas.indexMap.get("logSide"),
                        Texture.testAtkas.indexMap.get("logSide")
                    ],
                    breakTime: 5
                },
                {
                    name: "White",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("whiteBlock"),
                        Texture.testAtkas.indexMap.get("whiteBlock"),
                        Texture.testAtkas.indexMap.get("whiteBlock"),
                        Texture.testAtkas.indexMap.get("whiteBlock"),
                        Texture.testAtkas.indexMap.get("whiteBlock"),
                        Texture.testAtkas.indexMap.get("whiteBlock")
                    ],
                    breakTime: 20
                },
                {
                    name: "Yellow",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("redBlock"),
                        Texture.testAtkas.indexMap.get("redBlock"),
                        Texture.testAtkas.indexMap.get("redBlock"),
                        Texture.testAtkas.indexMap.get("redBlock"),
                        Texture.testAtkas.indexMap.get("redBlock"),
                        Texture.testAtkas.indexMap.get("redBlock")
                    ],
                    breakTime: 20
                },
                {
                    name: "Leaves",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("leaves"),
                        Texture.testAtkas.indexMap.get("leaves"),
                        Texture.testAtkas.indexMap.get("leaves"),
                        Texture.testAtkas.indexMap.get("leaves"),
                        Texture.testAtkas.indexMap.get("leaves"),
                        Texture.testAtkas.indexMap.get("leaves")
                    ],
                    breakTime: 0.2
                },
                {
                    name: "Glowstone",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("glowstone"),
                        Texture.testAtkas.indexMap.get("glowstone"),
                        Texture.testAtkas.indexMap.get("glowstone"),
                        Texture.testAtkas.indexMap.get("glowstone"),
                        Texture.testAtkas.indexMap.get("glowstone"),
                        Texture.testAtkas.indexMap.get("glowstone")
                    ],
                    breakTime: 5,
                    glowing: 15
                },
                {
                    name: "Snow",
                    type: blockType.FULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow")
                    ],
                    breakTime: 1
                },
                {
                    name: "Dirt slab",
                    type: blockType.NOTFULL,
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("dirt"),
                        Texture.testAtkas.indexMap.get("dirtSlab"),
                        Texture.testAtkas.indexMap.get("dirtSlab"),
                        Texture.testAtkas.indexMap.get("dirtSlab"),
                        Texture.testAtkas.indexMap.get("dirtSlab")
                    ],
                    customMesh: slab,
                    breakTime: 1
                }];
    }
    static info = [];
}
export var Side;
(function (Side) {
    Side[Side["top"] = 0] = "top";
    Side[Side["bottom"] = 1] = "bottom";
    Side[Side["front"] = 2] = "front";
    Side[Side["back"] = 3] = "back";
    Side[Side["left"] = 4] = "left";
    Side[Side["right"] = 5] = "right";
})(Side || (Side = {}));
export const directions = Object.freeze({
    UNDEF: 0,
    POS_X: 1,
    NEG_X: 2,
    POS_Z: 3,
    NEG_Z: 4,
    POS_Y: 5,
    NEG_Y: 6,
    SOURCE: 7
});
export const dirAssoc = Object.freeze({
    1: new Vector(1, 0, 0),
    2: new Vector(-1, 0, 0),
    3: new Vector(0, 0, 1),
    4: new Vector(0, 0, -1),
    5: new Vector(0, 1, 0),
    6: new Vector(0, -1, 0)
});
const slab = [
    [
        -0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,
        0.5, 0.0, 0.5,
        0.5, 0.0, -0.5,
    ],
    [
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
    ],
    [
        0.5, 0.0, 0.5,
        -0.5, 0.0, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
    ],
    //Back
    [
        -0.5, -0.5, -0.5,
        -0.5, 0.0, -0.5,
        0.5, 0.0, -0.5,
        0.5, -0.5, -0.5,
    ],
    //left
    [
        0.5, 0.0, 0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, 0.0, -0.5,
    ],
    //right
    [
        -0.5, 0.0, 0.5,
        -0.5, 0.0, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
    ]
];
