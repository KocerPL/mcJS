import { Texture } from "../Engine/Texture.js";
import { Vector } from "../Engine/Utils/Vector.js";
class Block {
    id;
    lightFBlock = 0;
    skyLight = 0;
    constructor(id) {
        this.id = id;
    }
    static createInfoArray() {
        Block.info =
            [{
                    name: "Air"
                },
                {
                    name: "Dirt",
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
                    textureIndex: [
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow"),
                        Texture.testAtkas.indexMap.get("snow")
                    ],
                    breakTime: 1
                }];
    }
    static info = [];
}
export { Block };
export var Side;
(function (Side) {
    Side[Side["top"] = 0] = "top";
    Side[Side["bottom"] = 1] = "bottom";
    Side[Side["front"] = 2] = "front";
    Side[Side["back"] = 3] = "back";
    Side[Side["left"] = 4] = "left";
    Side[Side["right"] = 5] = "right";
})(Side || (Side = {}));
export const blocks = [
    {
        name: "Air"
    },
    {
        name: "Dirt",
        textureIndex: [
            0,
            0,
            0,
            0,
            0,
            0
        ],
        breakTime: 2
    },
    {
        name: "Grass",
        textureIndex: [
            2,
            0,
            1,
            1,
            1,
            1
        ],
        breakTime: 2
    },
    {
        name: "Stone",
        textureIndex: [
            3,
            3,
            3,
            3,
            3,
            3
        ],
        breakTime: 20
    },
    {
        name: "Greenstone ore",
        textureIndex: [
            4,
            4,
            4,
            4,
            4,
            4
        ],
        breakTime: 20
    },
    {
        name: "Greenstone block",
        textureIndex: [
            5,
            5,
            5,
            5,
            5,
            5
        ],
        breakTime: 10
    },
    {
        name: "log",
        textureIndex: [
            7,
            7,
            6,
            6,
            6,
            6
        ],
        breakTime: 5
    },
    {
        name: "Light blue",
        textureIndex: [
            8,
            8,
            8,
            8,
            8,
            8
        ],
        breakTime: 20
    },
    {
        name: "Yellow",
        textureIndex: [
            9,
            9,
            9,
            9,
            9,
            9
        ],
        breakTime: 20
    },
    {
        name: "Leaves",
        textureIndex: [
            10,
            10,
            10,
            10,
            10,
            10
        ],
        breakTime: 0.2
    },
    {
        name: "Glowstone",
        textureIndex: [
            11,
            11,
            11,
            11,
            11,
            11
        ],
        breakTime: 5,
        glowing: 15
    },
    {
        name: "Snow",
        textureIndex: [
            14,
            14,
            14,
            14,
            14,
            14
        ],
        breakTime: 1
    }
];
blocks[-1] =
    {
        name: "Water",
        textureIndex: [
            12,
            12,
            12,
            12,
            12,
            12
        ]
    };
blocks[-2] =
    {
        name: "Flowing water",
        textureIndex: [
            12,
            12,
            12,
            12,
            12,
            12
        ]
    };
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
