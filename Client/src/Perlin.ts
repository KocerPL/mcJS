import {get,Perlin,PerlinN,pseudoRandom,pseudoRandomXZ} from './PerlinNoise.js';
let canva:HTMLCanvasElement = document.createElement("canvas");
document.body.appendChild(canva);
let ctx:CanvasRenderingContext2D = canva.getContext("2d");
ctx.imageSmoothingEnabled = false;
let rand = new PerlinN();
console.time("test");
for(let x=0; x<canva.width;x++)
for(let y=0; y<canva.height;y++)
{
    
ctx.fillRect(x,y,1,1);
let randNum:number = rand.get(x/8,y/2)*255;// rand.next().value/2147483647 * 255;
ctx.fillStyle="rgb("+randNum+","+randNum+","+randNum+")";
}
console.timeEnd("test");
let k;
