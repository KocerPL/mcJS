import { CanvaManager } from "./CanvaManager.js";

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
    public static imageArray(path:string):WebGLTexture
    {
        let img =  new Image();
        img.src = path;
       img.decode();
       let testCanv = document.createElement("canvas");
       testCanv.width=9;
       testCanv.height=9;
       let ctx =testCanv.getContext("2d");
       ctx.drawImage(img,9,0,18,9,0,0,9,9);
       let buff = ctx.getImageData(0,0,9,9);
       //loading image ^
       //Buffering image
       let texture = gl.createTexture();
       gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);
       gl.activeTexture(gl.TEXTURE0);
       img.onload = ()=>{
          gl.bindTexture(gl.TEXTURE_2D_ARRAY,texture);  
        //  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY,0,gl.RGBA8,9,9,10,0,gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY,0,0,0,1,9,9,1,gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY,0,0,0,3,9,9,1,gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY,0,0,0,2,9,9,1,gl.RGBA,gl.UNSIGNED_BYTE,buff);
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