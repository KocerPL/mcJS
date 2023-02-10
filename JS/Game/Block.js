import { Vector } from "../Engine/Utils/Vector.js";
export class Block {
    id;
    lightFBlock = 0;
    lightDir = directions.UNDEF;
    skyLight = 0;
    skyLightDir = directions.UNDEF;
    attribute;
    constructor(id) {
        this.id = id;
    }
}
export var blocks = [
    {
        name: "Air"
    },
    {
        name: "Dirt",
        textureIndex: {
            top: 0,
            bottom: 0,
            front: 0,
            back: 0,
            left: 0,
            right: 0
        },
        breakTime: 3
    },
    {
        name: "Grass",
        textureIndex: {
            top: 2,
            bottom: 0,
            front: 1,
            back: 1,
            left: 1,
            right: 1
        },
        breakTime: 3
    },
    {
        name: "Stone",
        textureIndex: {
            top: 3,
            bottom: 3,
            front: 3,
            back: 3,
            left: 3,
            right: 3
        },
        breakTime: 20
    },
    {
        name: "Greenstone ore",
        textureIndex: {
            top: 4,
            bottom: 4,
            front: 4,
            back: 4,
            left: 4,
            right: 4
        },
        breakTime: 20
    },
    {
        name: "Greenstone block",
        textureIndex: {
            top: 5,
            bottom: 5,
            front: 5,
            back: 5,
            left: 5,
            right: 5
        },
        breakTime: 10
    },
    {
        name: "log",
        textureIndex: {
            top: 7,
            bottom: 7,
            front: 6,
            back: 6,
            left: 6,
            right: 6
        },
        breakTime: 10
    },
    {
        name: "Light blue",
        textureIndex: {
            top: 8,
            bottom: 8,
            front: 8,
            back: 8,
            left: 8,
            right: 8
        },
        breakTime: 20
    },
    {
        name: "Yellow",
        textureIndex: {
            top: 9,
            bottom: 9,
            front: 9,
            back: 9,
            left: 9,
            right: 9
        },
        breakTime: 20
    },
    {
        name: "Leaves",
        textureIndex: {
            top: 10,
            bottom: 10,
            front: 10,
            back: 10,
            left: 10,
            right: 10
        },
        breakTime: 0.2
    },
    {
        name: "Glowstone",
        textureIndex: {
            top: 11,
            bottom: 11,
            front: 11,
            back: 11,
            left: 11,
            right: 11
        },
        breakTime: 5
    },
];
blocks[-1] =
    {
        name: "Water",
        textureIndex: {
            top: 12,
            bottom: 12,
            front: 12,
            back: 12,
            left: 12,
            right: 12
        }
    };
blocks[-2] =
    {
        name: "Flowing water",
        textureIndex: {
            top: 12,
            bottom: 12,
            front: 12,
            back: 12,
            left: 12,
            right: 12
        }
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
