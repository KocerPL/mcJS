export class Matrix extends Float32Array
{
constructor(...[args])
{
    super(args==undefined|| (args.length<=1&&args[0]==1) ?[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]:args);
    this.rows = new Array();
}
get(x,y) 
{
    return this[x+(y*4)];
}
static toTransformation(mat)
{
    return mat;
}
static projection(fov,nearPlane,farPlane,aspectRatio)
{
    let mat = new Matrix();
    // (h/w)*1/tan(fov/2)   0            0          0
    // 0                    1/tan(fov/2) 0          0
    // 0                    0            zf/(zf-zn) (zf/(zf-zn))*zn
    // 0                    0            1          0
let fovRel = 1/Math.tan((fov/2)*(Math.PI/180));
console.log(fovRel);
console.log(aspectRatio);
this.clearMat(mat);
console.log(aspectRatio*fovRel);
mat[0] = aspectRatio*fovRel;
mat[5] = fovRel;
mat[10] = (farPlane/(farPlane-nearPlane));
mat[11]=   -((farPlane)/(farPlane-nearPlane))*nearPlane;
mat[14]=1;
return mat;
}
static clearMat(mat)
{
    for(var i=0;i<mat.length;i++)
    {
        mat[i]=0;
    }
}
static invert(m)
{
    let inv=new Array();
    let det;
    let i;

    inv[0] = m[5]  * m[10] * m[15] - 
             m[5]  * m[11] * m[14] - 
             m[9]  * m[6]  * m[15] + 
             m[9]  * m[7]  * m[14] +
             m[13] * m[6]  * m[11] - 
             m[13] * m[7]  * m[10];

    inv[4] = -m[4]  * m[10] * m[15] + 
              m[4]  * m[11] * m[14] + 
              m[8]  * m[6]  * m[15] - 
              m[8]  * m[7]  * m[14] - 
              m[12] * m[6]  * m[11] + 
              m[12] * m[7]  * m[10];

    inv[8] = m[4]  * m[9] * m[15] - 
             m[4]  * m[11] * m[13] - 
             m[8]  * m[5] * m[15] + 
             m[8]  * m[7] * m[13] + 
             m[12] * m[5] * m[11] - 
             m[12] * m[7] * m[9];

    inv[12] = -m[4]  * m[9] * m[14] + 
               m[4]  * m[10] * m[13] +
               m[8]  * m[5] * m[14] - 
               m[8]  * m[6] * m[13] - 
               m[12] * m[5] * m[10] + 
               m[12] * m[6] * m[9];

    inv[1] = -m[1]  * m[10] * m[15] + 
              m[1]  * m[11] * m[14] + 
              m[9]  * m[2] * m[15] - 
              m[9]  * m[3] * m[14] - 
              m[13] * m[2] * m[11] + 
              m[13] * m[3] * m[10];

    inv[5] = m[0]  * m[10] * m[15] - 
             m[0]  * m[11] * m[14] - 
             m[8]  * m[2] * m[15] + 
             m[8]  * m[3] * m[14] + 
             m[12] * m[2] * m[11] - 
             m[12] * m[3] * m[10];

    inv[9] = -m[0]  * m[9] * m[15] + 
              m[0]  * m[11] * m[13] + 
              m[8]  * m[1] * m[15] - 
              m[8]  * m[3] * m[13] - 
              m[12] * m[1] * m[11] + 
              m[12] * m[3] * m[9];

    inv[13] = m[0]  * m[9] * m[14] - 
              m[0]  * m[10] * m[13] - 
              m[8]  * m[1] * m[14] + 
              m[8]  * m[2] * m[13] + 
              m[12] * m[1] * m[10] - 
              m[12] * m[2] * m[9];

    inv[2] = m[1]  * m[6] * m[15] - 
             m[1]  * m[7] * m[14] - 
             m[5]  * m[2] * m[15] + 
             m[5]  * m[3] * m[14] + 
             m[13] * m[2] * m[7] - 
             m[13] * m[3] * m[6];

    inv[6] = -m[0]  * m[6] * m[15] + 
              m[0]  * m[7] * m[14] + 
              m[4]  * m[2] * m[15] - 
              m[4]  * m[3] * m[14] - 
              m[12] * m[2] * m[7] + 
              m[12] * m[3] * m[6];

    inv[10] = m[0]  * m[5] * m[15] - 
              m[0]  * m[7] * m[13] - 
              m[4]  * m[1] * m[15] + 
              m[4]  * m[3] * m[13] + 
              m[12] * m[1] * m[7] - 
              m[12] * m[3] * m[5];

    inv[14] = -m[0]  * m[5] * m[14] + 
               m[0]  * m[6] * m[13] + 
               m[4]  * m[1] * m[14] - 
               m[4]  * m[2] * m[13] - 
               m[12] * m[1] * m[6] + 
               m[12] * m[2] * m[5];

    inv[3] = -m[1] * m[6] * m[11] + 
              m[1] * m[7] * m[10] + 
              m[5] * m[2] * m[11] - 
              m[5] * m[3] * m[10] - 
              m[9] * m[2] * m[7] + 
              m[9] * m[3] * m[6];

    inv[7] = m[0] * m[6] * m[11] - 
             m[0] * m[7] * m[10] - 
             m[4] * m[2] * m[11] + 
             m[4] * m[3] * m[10] + 
             m[8] * m[2] * m[7] - 
             m[8] * m[3] * m[6];

    inv[11] = -m[0] * m[5] * m[11] + 
               m[0] * m[7] * m[9] + 
               m[4] * m[1] * m[11] - 
               m[4] * m[3] * m[9] - 
               m[8] * m[1] * m[7] + 
               m[8] * m[3] * m[5];

    inv[15] = m[0] * m[5] * m[10] - 
              m[0] * m[6] * m[9] - 
              m[4] * m[1] * m[10] + 
              m[4] * m[2] * m[9] + 
              m[8] * m[1] * m[6] - 
              m[8] * m[2] * m[5];

    det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

    if (det == 0)
        return false;

    det = 1.0 / det;
let invOut = new Array();
    for (i = 0; i < 16; i++)
        invOut[i] = inv[i] * det;

    return invOut;

}
//TODO: vectors
static view(x,y,z,pitch,yaw)
{
    let rPitch = pitch*(Math.PI/180);
    let rYaw = yaw*(Math.PI/180);
    let cosYaw = Math.cos(rYaw);
    let sinYaw = Math.sin(rYaw);
    let cosPitch = Math.cos(rPitch);
    let sinPitch = Math.sin(rPitch);
    let mat = new Matrix(
     [
        -sinYaw,cosYaw,0,(x*sinYaw)-(y*cosYaw),
        -sinPitch,-sinPitch*sinYaw,cosPitch,(sinPitch*((x*cosYaw)+(y*sinYaw)))-(z*cosPitch),
        -cosPitch*cosYaw,-cosPitch*sinYaw,-sinPitch,(cosPitch*((x*cosYaw)+(y*sinYaw)))+(z*sinPitch),
        0,0,0,1
     ]);
console.log(mat);
return Matrix.invert(mat);
}
static viewFPS(x,y,z,pitch,yaw)
{
   let rPitch = pitch*(Math.PI/180);
    let rYaw = yaw*(Math.PI/180);
    let cosYaw = Math.cos(rYaw);
    let sinYaw = Math.sin(rYaw);
    let cosPitch = Math.cos(rPitch);
    let sinPitch = Math.sin(rPitch);
    let xAxis = {x:cosYaw,y:0,z:-sinYaw};
    let yAxis = {x:sinYaw*sinPitch,y:cosPitch,z:cosYaw*sinPitch};
    let zAxis = {x:sinYaw*cosPitch,y:-sinPitch,z:cosYaw*cosPitch};
    //create view matrix
   let view =new Float32Array( [
    xAxis.x,yAxis.x,zAxis.x, 0,
    xAxis.y,yAxis.y,zAxis.y,0,
    xAxis.z,yAxis.z,zAxis.z,0,
    //dot products
    -((xAxis.x*x)+(xAxis.y*y)+(xAxis.z*z)),-((yAxis.x*x)+(yAxis.y*y)+(yAxis.z*z)),-((zAxis.x*x)+(zAxis.y*y)+(zAxis.z*z)),1 
    ]);
    //view2
    let view2 = new Matrix();
   view2= view2.rotateX(pitch);
    view2 =view2.rotateY(yaw);
    view2 =view2.translate(-x,-y,-z);
    return view2;
    let view3 = new Matrix(
        {
            
        }
    )

}
static hackyInverse(mat) // works only for rotation and translation!!
{
    let copyTransp = this.transpose(mat);
    copyTransp[12] = mat[12];
    copyTransp[13] = mat[13];
    copyTransp[14] = mat[14];
    copyTransp[15] = mat[15];
    copyTransp[3] = -mat[3];
    copyTransp[7] = -mat[7];
    copyTransp[11] = -mat[11];
    return copyTransp;
}
static getDeterminant(mat)
{
    //crosses!
let leftdown = (mat[0]*mat[5]*mat[10]*mat[15])+(mat[1]*mat[6]*mat[11]*mat[12])+(mat[2]*mat[7]*mat[8]*mat[13])+(mat[1]*mat[4]*mat[9]*mat[14]);
let rightdown = (mat[3]*mat[6]*mat[9]*mat[12])+(mat[0]*mat[7]*mat[10]*mat[13])+(mat[1]*mat[4]*mat[11]*mat[14])+(mat[2]*mat[5]*mat[8]*mat[15]);
return leftdown-rightdown ;
}
translate(x,y,z)
{
    let transl = new Matrix();
    transl[3] = x;
    transl[7]=y;
    transl[11] = z;
    return Matrix.mult(this,transl);

}
rotateX(degrees)
{
    let radians = degrees*(Math.PI/180);
    let rotMatrix = new Matrix;
    rotMatrix[5]= Math.cos(radians);
    rotMatrix[6]=-Math.sin(radians);
    rotMatrix[9]= Math.sin(radians);
    rotMatrix[10]=Math.cos(radians);
    return Matrix.mult(this,rotMatrix);
}
rotateY(degrees)
{
    let radians = degrees*(Math.PI/180);
    let rotMatrix = new Matrix;
    rotMatrix[0]= Math.cos(radians);
    rotMatrix[2]=-Math.sin(radians);
    rotMatrix[8]= Math.sin(radians);
    rotMatrix[10]=Math.cos(radians);
    return Matrix.mult(this,rotMatrix);
}
static rotateX(mat,degrees)
{
    let radians = degrees*(Math.PI/180);
    let rotMatrix = new Matrix;
    rotMatrix[5]= Math.cos(radians);
    rotMatrix[6]=-Math.sin(radians);
    rotMatrix[9]= Math.sin(radians);
    rotMatrix[10]=Math.cos(radians);
    return Matrix.mult(mat,rotMatrix);
}
static rotateY(mat,degrees)
{
    let radians = degrees*(Math.PI/180);
    let rotMatrix = new Matrix;
    rotMatrix[0]= Math.cos(radians);
    rotMatrix[2]=-Math.sin(radians);
    rotMatrix[8]= Math.sin(radians);
    rotMatrix[10]=Math.cos(radians);
    return this.mult(mat,rotMatrix);
}
static rotateZ(mat,degrees)
{
    let radians = degrees*(Math.PI/180);
    let rotMatrix = new Matrix;
    rotMatrix[0]= Math.cos(radians);
    rotMatrix[1]=-Math.sin(radians);
    rotMatrix[4]= Math.sin(radians);
    rotMatrix[5]=Math.cos(radians);
    return this.mult(mat,rotMatrix);
}
static mult(mat1,mat2)
{
    let multiplied = new Matrix;
    for(var i=0;i<4;i++)
    {
    multiplied[i] = (mat1[0]*mat2[i])+(mat1[1]*mat2[4+i])+(mat1[2]*mat2[8+i])+(mat1[3]*mat2[12+i]);
    multiplied[i+4] = (mat1[4]*mat2[i])+(mat1[5]*mat2[4+i])+(mat1[6]*mat2[8+i])+(mat1[7]*mat2[12+i]);
    multiplied[i+8] = (mat1[8]*mat2[i])+(mat1[9]*mat2[4+i])+(mat1[10]*mat2[8+i])+(mat1[11]*mat2[12+i]);
    multiplied[i+12] =(mat1[12]*mat2[i])+(mat1[13]*mat2[4+i])+(mat1[14]*mat2[8+i])+(mat1[15]*mat2[12+i]);
    }
    return multiplied;
}
static transpose(mat)
{
    let transp = new Matrix();
    transp[0] = mat[0];
    transp[1]= mat[4];
    transp[2] = mat[8];
    transp[3]= mat[12];
    transp[4] = mat[2];
    transp[5] = mat[5]
    transp[6] = mat[9];
    transp[7]=mat[13];
    transp[8]= mat[2];
    transp[9]=mat[6];
    transp[10] = mat[10];
    transp[11] =mat[14];
    transp[12] = mat[3];
    transp[13]= mat[7];
    transp[14] = mat[11];
    transp[15] = mat[15];
    return transp;
}
}