export var rot2d;
(function (rot2d) {
    rot2d[rot2d["D90"] = 0] = "D90";
    rot2d[rot2d["D180"] = 1] = "D180";
    rot2d[rot2d["D270"] = 2] = "D270";
})(rot2d || (rot2d = {}));
export const Model = {
    player: [
        {
            pos: [8, 8],
            size: [8, 8]
        },
        {
            pos: [24, 8],
            size: [8, 8]
        },
        {
            pos: [0, 8],
            size: [8, 8]
        },
        {
            pos: [16, 8],
            size: [8, 8],
            rotation: rot2d.D180
        },
        {
            pos: [8, 0],
            size: [8, 8],
            rotation: rot2d.D90
        },
        {
            pos: [16, 0],
            size: [8, 8]
        },
        {
            pos: [20, 20],
            size: [8, 12]
        },
        {
            pos: [28, 20],
            size: [8, 12]
        },
        {
            pos: [16, 20],
            size: [4, 12]
        },
        {
            pos: [36, 20],
            size: [4, 12]
        },
        {
            pos: [20, 16],
            size: [8, 4]
        },
        {
            pos: [28, 16],
            size: [8, 4]
        },
        {
            pos: [4, 20],
            size: [4, 12]
        },
        {
            pos: [8, 20],
            size: [4, 12]
        },
        {
            pos: [0, 20],
            size: [4, 12]
        },
        {
            pos: [12, 20],
            size: [4, 12]
        },
        {
            pos: [4, 16],
            size: [4, 4]
        },
        {
            pos: [8, 16],
            size: [4, 4]
        },
        //right leg
        {
            pos: [20, 52],
            size: [4, 12]
        },
        {
            pos: [24, 52],
            size: [4, 12]
        },
        {
            pos: [16, 52],
            size: [4, 12]
        },
        {
            pos: [28, 52],
            size: [4, 12]
        },
        {
            pos: [20, 48],
            size: [4, 4]
        },
        {
            pos: [24, 48],
            size: [4, 4]
        },
        //left arm
        {
            pos: [44, 20],
            size: [4, 12]
        },
        {
            pos: [48, 20],
            size: [4, 12]
        },
        {
            pos: [40, 20],
            size: [4, 12]
        },
        {
            pos: [52, 20],
            size: [4, 12]
        },
        {
            pos: [44, 16],
            size: [4, 4]
        },
        {
            pos: [48, 16],
            size: [4, 4]
        },
        //right arm
        {
            pos: [36, 52],
            size: [4, 12]
        },
        {
            pos: [40, 52],
            size: [4, 12]
        },
        {
            pos: [32, 52],
            size: [4, 12]
        },
        {
            pos: [44, 52],
            size: [4, 12]
        },
        {
            pos: [36, 48],
            size: [4, 4]
        },
        {
            pos: [40, 48],
            size: [4, 4]
        },
    ]
};
