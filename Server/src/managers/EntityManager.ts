import { Entity } from "../Entities/Entity";

export class EntityManager
{
    entitites:Set<Entity>= new Set();
    getByAABB(x:number,y:number,z:number,dx:number,dy:number,dz:number):Array<Entity>
    {
        const entitiesInArea:Array<Entity> = new Array(); 
        for(let entity of this.entitites)
        {
            if(entity.pos.isIn(x,y,z,dx,dy,dz))
            entitiesInArea.push(entity);
        }
        return entitiesInArea;
    }
    remove(entity:Entity)
    {
        this.entitites.delete(entity);
    }
    add(entity:Entity)
    {
        this.entitites.add(entity);
    }
    update()
    {
        for(let entity of this.entitites)
        {
            
        }
    }
}