import { Matrix } from "./Utils/Matrix.js";

export class Renderer
{
    static prepare(gl,shader)
    {
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
shader.use(gl);
    }
    static render(gl,model,shader,projectionMatrix,viewMatrix)
    {
        
      //model.transformation = Matrix.rotateY(model.transformation,0.5);
    //  model.transformation = Matrix.rotateX(model.transformation,0.5);
     
     
        shader.loadUniforms(model.transformation,projectionMatrix,viewMatrix);
            model.vao.bind(gl);
        gl.drawElements(gl.TRIANGLES,model.vertexCount,  gl.UNSIGNED_INT,0);
        model.vao.unbind(gl);
    }
}