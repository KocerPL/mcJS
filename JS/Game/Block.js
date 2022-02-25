export class Block {
    id;
    lightLevel = 0;
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
        }
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
        }
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
        }
    },
    {
        name: "Greenstone",
        textureIndex: {
            top: 3,
            bottom: 3,
            front: 4,
            back: 4,
            left: 4,
            right: 4
        }
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
        }
    },
];
