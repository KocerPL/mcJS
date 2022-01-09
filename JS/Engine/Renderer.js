import { Matrix } from "./Utils/Matrix.js";

export class Renderer
{
    static prepare(gl)
    {
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    static render(gl,model,shader,projectionMatrix,viewMatrix)
    {
        
      model.transformation = Matrix.rotateY(model.transformation,0.5);
      model.transformation = Matrix.rotateX(model.transformation,0.5);
        shader.use(gl);
        model.vao.bind(gl);
        shader.loadUniforms(model.transformation,projectionMatrix,viewMatrix);
        gl.drawElements(gl.TRIANGLES,model.vertexCount,  gl.UNSIGNED_INT,0);
        model.vao.unbind(gl);
    }
}