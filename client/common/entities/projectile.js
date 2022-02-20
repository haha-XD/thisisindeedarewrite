import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'
import radians from '../utils/radians.js';

export class Projectile extends Entity {
    category = ENTITY_CATEGORY.projectiles;
    objType = this.constructor.name;

    constructor({x, y, size, damage, speed, lifetime}) {
        super(x, y, size)
        this.startX = x;
        this.startY = y; //used in determining where bullet is
        this.size = size;
        this.damage = damage;
        this.speed = speed;
        this.lifetime = lifetime;
    }

    tick(manager) {
        const elapsedTime = (Date.now() - this.creationTs)/1000;

        if (elapsedTime > this.lifetime) return false;
        if (this.detectEntityCollision(manager.player)) return false;
        for (const wallEntity of Object.values(manager.entities.walls)) {
            if (this.detectEntityCollision(wallEntity)) return false;
        }

        this.x = this.startX + elapsedTime * this.speed * Math.cos(radians(this.direction));
        this.y = this.startY + elapsedTime * this.speed * Math.sin(radians(this.direction));
        return true;
    }
} 