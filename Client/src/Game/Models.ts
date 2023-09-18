export enum rot2d
{
    D90,
    D180,
    D270,
}
export const Model=
{
    player:[
        {//0 frontHead
            pos:[8,8],
            size:[8,8]
        },
        {//1 back Head
            pos:[24,8],
            size:[8,8],
            rotation:rot2d.D90
        },
        {//2 leftHead
            pos:[0,8],
            size:[8,8],
            rotation:rot2d.D90
        },
        {//3 rightHead
            pos:[16,8],
            size:[8,8],
            rotation:rot2d.D180
        },
        {//4 topHead
            pos:[8,0],
            size:[8,8],
            rotation:rot2d.D90

        },
        {//5 bottomHead
            pos:[16,0],
            size:[8,8]
        },
        {//6 front Body
            pos:[20,20],
            size:[8,12]
        },
        {//7 back Body
            pos:[28,20],
            size:[8,12],
            rotation:rot2d.D90
        },
        {//8 left Body
            pos:[16,20],
            size:[4,12],
            rotation:rot2d.D90
        },
        {//9 right Body
            pos:[36,20],
            size:[4,12]
        },
        {//10 top Body
            pos:[20,16],
            size:[8,4]
        },
        {//11 bottom Body
            pos:[28,16],
            size:[8,4]
        },
        { //12 back left leg
            pos:[8,20],
            size:[4,12],
            rotation:rot2d.D90
        },
        { // 13 front left leg
            pos:[4,20],
            size:[4,12]
        },  
        {//14 left left leg
            pos:[0,20],
            size:[4,12],
            rotation:rot2d.D90
        },
        {//15 right left leg
            pos:[12,20],
            size:[4,12]
        },
        { //16 top left leg 
            pos:[4,16],
            size:[4,4]
        },
        { //17 bottom left leg 
            pos:[8,16],
            size:[4,4]
        },
        //right leg
        { //18 back right leg
            pos:[24,52],
            size:[4,12],
            rotation:rot2d.D90
        },
        { // 19 front right leg
            pos:[20,52],
            size:[4,12]
        },
       
        {//20 left right leg
            pos:[16,52],
            size:[4,12],
            rotation:rot2d.D90
        },
        {//21 right right leg
            pos:[28,52],
            size:[4,12]
        },
        { //22 top right leg 
            pos:[20,48],
            size:[4,4]
        },
        { //23 bottom right leg 
            pos:[24,48],
            size:[4,4]
        }, 
        //left arm
        { //24 back left arm
            pos:[48,20],
            size:[4,12],
            rotation:rot2d.D90
        },
        { // 25 front left arm
            pos:[44,20],
            size:[4,12]
        },
       
        {//26 left left arm
            pos:[40,20],
            size:[4,12],
            rotation:rot2d.D90
        },
        {//27 right left arm
            pos:[52,20],
            size:[4,12]
        },
        { //28 top left arm
            pos:[44,16],
            size:[4,4]
        },
        { //29 bottom left arm 
            pos:[48,16],
            size:[4,4]
        },
        //right arm
        { //18 back right arm
            pos:[40,52],
            size:[4,12],
            rotation:rot2d.D90
        },
        { // 19 front right arm
            pos:[36,52],
            size:[4,12]
        },
       
        {//20 left right arm
            pos:[32,52],
            size:[4,12],
            rotation:rot2d.D90
        },
        {//21 right right arm
            pos:[44,52],
            size:[4,12]
        },
        { //22 top right arm
            pos:[36,48],
            size:[4,4]
        },
        { //23 bottom right arm 
            pos:[40,48],
            size:[4,4]
        }, 
    ]
};