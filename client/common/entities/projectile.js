import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'
import radians from '../utils/radians.js';
import Point from '../utils/point.js'

export class Projectile extends Entity {
    category = ENTITY_CATEGORY.projectiles;
    objType = this.constructor.name;
    doNotUpdate = true;

    constructor({x, y, speed, size, lifetime, damage, direction}) {
        super(x, y, size, -1) //id is -1
        this.startX = x;
        this.startY = y; //used in determining where bullet is
        this.size = size;
        this.speed = speed;
        this.lifetime = lifetime;
        this.damage = damage;
        this.direction = direction;
    }

    tick(manager, elapsedTime) {
        if (elapsedTime > this.lifetime) return false;
        for (const wallEntity of Object.values(manager.walls)) {
            if (this.detectEntityCollision(wallEntity)) return false;
        }
        return true;
    }

    getPosition(elapsedTime) {
        const x = this.startX + elapsedTime * this.speed * Math.cos(radians(this.direction))/100;
        const y = this.startY + elapsedTime * this.speed * Math.sin(radians(this.direction))/100;
        return new Point(x, y);
    }
} 