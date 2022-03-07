import { CanvaManager } from "./CanvaManager.js";
import { Vector } from "./Utils/Vector.js";

let gl = CanvaManager.gl;
export class Loader
{
    public static txtFile(path:string)
    {
        let req = new  XMLHttpRequest;
        req.open('GET', path, false);
        req.send(null);
     return req.responseText;
    }
    public static image(path:string):WebGLTexture
    {
        let img =  new Image();
        img.src = path;
       img.decode();
       //loading image ^
       //Buffering image
       let texture = gl.createTexture();
       gl.bindTexture(gl.TEXTURE_2D,texture);
       gl.activeTexture(gl.TEXTURE0);
       img.onload = ()=>{
          gl.bindTexture(gl.TEXTURE_2D,texture);  
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA,gl.UNSIGNED_BYTE,img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
             gl.generateMipmap(gl.TEXTURE_2D);
             console.log("loaded gui");
          };
          if(img.complete)
          {
          img.onload(new Event("loaded"));
          }




        return texture;
    }
    public static imageArray(path:string,count:number,size:number):WebGLTexture
    {
        let img =  new Image();
        img.src = path;
       img.decode();
      
       //loading image ^
       //Buffering image
       let texture = gl.createTexture();
       gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);
       gl.activeTexture(gl.TEXTURE0);
       img.onload = ()=>{
         let testCanv = document.createElement("canvas");
         testCanv.width=img.width;
         testCanv.height=img.height;
         document.body.appendChild(testCanv);
         let ctx =testCanv.getContext("2d");
         ctx.clearRect(0,0,img.width,img.height);
         ctx.drawImage(img,0,0,img.width,img.height);
        // 
        
          gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);  
        //  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY,0,gl.RGBA8,size,size,count,0,gl.RGBA,gl.UNSIGNED_BYTE,img);
        let pos= new Vector(0,0,0);
        for(let i=0;i<count;i++)
        {
         let buff = ctx.getImageData(pos.x,pos.y,size,size).data;
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY,0,0,0,pos.z,size,size,1,gl.RGBA,gl.UNSIGNED_BYTE,buff);
        pos.x+=size;
        if(pos.x>img.width)
        {
           pos.x=0;
           pos.y+=size;
        }
        pos.z++;
        }
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D_ARRAY,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          //   gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
             console.log("loaded gui");
             
          };
          if(img.complete)
          {
          img.onload(new Event("loaded"));
          }




        return texture;
    }
}