"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
class EntityManager {
    entitites = new Set();
    getByAABB(x, y, z, dx, dy, dz) {
        const entitiesInArea = new Array();
        for (let entity of this.entitites) {
            if (entity.pos.isIn(x, y, z, dx, dy, dz))
                entitiesInArea.push(entity);
        }
        return entitiesInArea;
    }
    remove(entity) {
        this.entitites.delete(entity);
    }
    add(entity) {
        this.entitites.add(entity);
    }
    update() {
        for (let entity of this.entitites) {
        }
    }
}
exports.EntityManager = EntityManager;
