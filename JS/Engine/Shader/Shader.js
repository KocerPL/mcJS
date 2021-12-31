export class Shader
{
    constructor(vertFile,fragFile,gl)
    {
        let vertUncompiled =Shader.readFile(vertFile);
        let fragUncompiled=Shader.readFile(fragFile);
    let vertex = gl.createShader(gl.VERTEX_SHADER);
     gl.shaderSource(vertex,vertUncompiled);
     let fragment = gl.createShader(gl.FRAGMENT_SHADER);
     gl.shaderSource(fragment,fragUncompiled);
     gl.compileShader(vertex);
     gl.compileShader(fragment);
     if(!gl.getShaderParameter(vertex, gl.COMPILE_STATUS))
     {
         console.error("Cannot compile vertex shader", gl.getShaderInfoLog(vertex));
         return;
     }
     if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS))
     {
         console.error("Cannot compile fragment shader", gl.getShaderInfoLog(fragment));
         return;
     }
     this.program = gl.createProgram();
     gl.attachShader(this.program, vertex);
     gl.attachShader(this.program, fragment);
    
     // link the program.
     gl.linkProgram(this.program);
     if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
         throw ("program failed to link:" + gl.getProgramInfoLog(this.program));
     }
    
    }
    use(gl)
    {
        gl.useProgram(this.program);
    }
    static readFile(filePath)
    {
        var rawFile = new XMLHttpRequest();
        let allText =null;
        try{
        rawFile.open("GET", filePath, false);
        rawFile.onreadystatechange = ()=>
           {
               if(rawFile.readyState === 4)
               {
                   if(rawFile.status === 200 || rawFile.status == 0)
                   {
                        allText = rawFile.responseText;
                       
                   }
               }
           }
         rawFile.send(null);
        }
        catch( error)
        {
            console.log(error);
        } 
         return allText;
    }
}