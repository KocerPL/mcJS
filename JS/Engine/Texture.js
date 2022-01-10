export class Texture
{
    constructor(path)
    {

    }
   static async loadImage(path)
    {
    let img= new Image();
    img.src = path;
    await img.decode();
    return img;
    }
}