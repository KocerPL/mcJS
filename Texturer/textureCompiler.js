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
        width+=img.width;
        if(img.height>maxHeight)
        maxHeight=img.height;
        images.set(name.split(".")[1].split("/").reverse()[0],img);
      }
    }
}
width =256;
//Now paint all into canvas and save canvas as png
let atlasJSON = {};
console.log(width,"   ",maxHeight);
let canva = createCanvas(width,maxHeight+(maxHeight/2)+(maxHeight/4)+(maxHeight/8)+(maxHeight/16));
let ctx = canva.getContext("2d");
atlasJSON.sizes=[];
let yOffset=0;
let imgStart=0;
for(let val of images)
{
    console.log(val[1]);
   //ctx.drawImage(val[1],imgStart,0,val[1].width+2,val[1].height+2);
   ctx.drawImage(val[1],imgStart,yOffset,val[1].width,val[1].height);
   atlasJSON[val[0]] = {pos:[imgStart,yOffset],size:[val[1].width,val[1].height]};
   imgStart+=val[1].width;
   
}
atlasJSON.sizes.push([0,0,width,maxHeight])
yOffset=16;
for(let i=1;i<5;i++)
{
  imgStart=0;
for(let val of images)
{
    console.log(val[1]);
   //ctx.drawImage(val[1],imgStart,0,val[1].width+2,val[1].height+2);
   ctx.drawImage(val[1],imgStart,yOffset,val[1].width/(Math.pow(2,i)),val[1].height/(Math.pow(2,i)));
 //  atlasJSON[val[0]] = {pos:[imgStart,yOffset],size:[val[1].width,val[1].height]};
   imgStart+=val[1].width/(Math.pow(2,i));
   
}
atlasJSON.sizes.push([0,yOffset,width/(Math.pow(2,i)),maxHeight/(Math.pow(2,i))]);
yOffset+=maxHeight/(Math.pow(2,i));
}
let buf = canva.toBuffer("image/png");
fs.writeFileSync("./atlas.png",buf);
fs.writeFileSync("./atlas.json",JSON.stringify(atlasJSON));
}
run();
