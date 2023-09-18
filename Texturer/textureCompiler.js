const { Image,createCanvas, loadImage }= require("canvas");
const fs = require('fs');
var path = require('path');
//First load all images

async function run()
{
let images = new Map();
let dir = "./src";
const fileList = fs.readdirSync(dir);
let maxHeight=0;
let width=0;
for(const file of fileList)
{
    const name = `${dir}/${file}`;
    console.log(name);
    if(fs.statSync(name).isDirectory())
    {

    }
    else
    {
      if(path.extname(name)==".png")
      {
        let img = await loadImage(name);
        width+=img.width+2;
        if(img.height>maxHeight)
        maxHeight=img.height;
        images.set(name.split(".")[1].split("/").reverse()[0],img);
      }
    }
}
//Now paint all into canvas and save canvas as png
let atlasJSON = {};
console.log(width,"   ",maxHeight);
let canva = createCanvas(width,maxHeight+2);
let ctx = canva.getContext("2d");
let imgStart=0;
for(let val of images)
{
    console.log(val[1]);
   ctx.drawImage(val[1],imgStart,0,val[1].width+2,val[1].height+2);
   ctx.drawImage(val[1],imgStart+1,1,val[1].width,val[1].height);
   atlasJSON[val[0]] = {pos:[imgStart+1,1],size:[val[1].width,val[1].height]};
    imgStart+=val[1].width+2;
}
atlasJSON.size = [canva.width,canva.height];
let buf = canva.toBuffer("image/png");
fs.writeFileSync("./atlas.png",buf);
fs.writeFileSync("./atlas.json",JSON.stringify(atlasJSON));
}
run();
