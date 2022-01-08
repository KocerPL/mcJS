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
        gl.linkProgram(this.program);
        gl.useProgram(this.program);
    }
    loadUniforms(transformationMatrix,projectionMatrix,viewMatrix)
    {
        let transf = this.getUniform('transformation');
        this.loadMatrix(transf,transformationMatrix);
        let proj = this.getUniform('projection');
        this.loadMatrix(proj,projectionMatrix);
        let vm = this.getUniform('view');
        this.loadMatrix(vm,viewMatrix);
    }
    getUniform(name)
    {
        return gl.getUniformLocation(this.program,name);
    }
    loadFloat(location,float)
    {
        gl.uniform1f(location,float);
    }
    loadMatrix(location,matrix)
    {
        gl.uniformMatrix4fv(location,false,new Float32Array(matrix));
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