import { Entity } from "../Entities/Entity";
import { Main } from "../Main";
import { NetworkListener, NetworkManager } from "./NetworkManager";

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
        console.log("kILLED"+entity.uuid);
        Main.networkManager.io. emit("killEntity",entity.uuid);
        this.entitites.delete(entity);
    }
    add(entity:Entity)
    {
        for(const ent of this.entitites)
        {
            if(ent.uuid == entity.uuid)
            return;
        }
        if(entity instanceof Entity)
        {
        this.entitites.add(entity);
        Main.networkManager.io.emit("spawnEntity",entity)
    }
    }
    update()
    {
        for(let entity of this.entitites)
        {
            entity.update();
        }
    }
}