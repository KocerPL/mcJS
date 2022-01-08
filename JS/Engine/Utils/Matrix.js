export class Matrix
{
constructor()
{
    let temp =
    [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];
    return new Float32Array(temp);
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
static invert(mat)
{
    let identity = new Matrix();
    // Add first rows together
    mat[0]+=mat[4];
    mat[1]+=mat[5];
    mat[2]+=mat[6];
    mat[3]+=mat[7];
    //
    identity[0]+=identity[4];
    identity[1]+=identity[5];
    identity[2]+=identity[6];
    identity[3]+=identity[7];
    //Divide first row by 5
    for(var i =0; i<4;i++)
    {
        mat[i]/=5;
        identity[i]/=5;
    }
    //Substract from second row first row multiplied by 2    
    for(var i =0; i<4;i++)
    {
        mat[i]/=5;
        identity[i]/=5;
    }

}
//TODO: vectors
static view(xRot,yRot,xPos,yPos,zPos)
{
let view = new Matrix;
view = this.rotateX(view,xRot);
view = this.rotateY(view,yRot);
view[3] = xPos;
view[7]=yPos;
view[11]=zPos;
return view;
}
static hackyInverse(mat) // works only for rotation and translation!!
{
    let copyTransp = this.transpose(mat);
    copyTransp[12] = mat[12];
    copyTransp[13] = mat[13];
    copyTransp[14] = mat[14];
    copyTransp[15] = mat[15];
    copyTransp[3] = -mat[3];
    copyTransp[4] = -mat[4];
    copyTransp[5] = -mat[5];
}
static getDeterminant(mat)
{
    //crosses!
let leftdown = (mat[0]*mat[5]*mat[10]*mat[15])+(mat[1]*mat[6]*mat[11]*mat[12])+(mat[2]*mat[7]*mat[8]*mat[13])+(mat[1]*mat[4]*mat[9]*mat[14]);
let rightdown = (mat[3]*mat[6]*mat[9]*mat[12])+(mat[0]*mat[7]*mat[10]*mat[13])+(mat[1]*mat[4]*mat[11]*mat[14])+(mat[2]*mat[5]*mat[8]*mat[15]);
return leftdown-rightdown ;
}
static rotateX(mat,degrees)
{
    let radians = degrees*(Math.PI/180);
    let rotMatrix = new Matrix;
    rotMatrix[5]= Math.cos(radians);
    rotMatrix[6]=-Math.sin(radians);
    rotMatrix[9]= Math.sin(radians);
    rotMatrix[10]=Math.cos(radians);
    return this.mult(mat,rotMatrix);
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