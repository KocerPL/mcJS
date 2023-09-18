export class Mesh
{
    vertices:Array<number>=[];
    indices:Array<number>=[];
    tCoords:Array<number>=[];
    lightLevels:Array<number>=[];
    fb:Array<number> =[];
    count=0;
    constructor()
    {
        this.reset();
    }

    public add(mesh:Mesh)
    {
        this.count = this.indices.length;
        this.vertices.push(...mesh.vertices);
        for(const indice of mesh.indices)
            this.indices.push( indice+((this.count*2)/3));
        this.tCoords.push(...mesh.tCoords);
        this.lightLevels.push(...mesh.lightLevels);
        this.fb.push(...mesh.fb);
        this.count = this.indices.length;
        
    }
    public reset()
    {
        delete this.vertices;
        delete this.indices;
        delete this.tCoords;
        delete this.fb;
        delete this.count;

        this.vertices = [];
        this.indices = [];
        this.tCoords = [];
        this.fb = [];
        this.lightLevels = [];
        this.count = 0;
    }
    
}