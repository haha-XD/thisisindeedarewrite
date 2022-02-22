import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'
import radians from '../utils/radians.js';
import Point from '../utils/point.js'

export class Projectile extends Entity {
    category = ENTITY_CATEGORY.projectiles;
    objType = this.constructor.name;

    constructor({x, y, size, projDesc}) {
        super(x, y, size)
        this.startX = x;
        this.startY = y; //used in determining where bullet is
        this.size = size;
        this.projDesc = projDesc
    }

    tick(manager, elapsedTime) {
        if (elapsedTime > this.lifetime) return false;
        if (this.detectEntityCollision(manager.player)) return false;
        for (const wallEntity of Object.values(manager.entities.walls)) {
            if (this.detectEntityCollision(wallEntity)) return false;
        }
        return true;
    }

    getPosition(elapsedTime) {
        const x = this.startX + elapsedTime * this.speed * Math.cos(radians(this.direction));
        const y = this.startY + elapsedTime * this.speed * Math.sin(radians(this.direction));
        return new Point(x, y);
    }
} 