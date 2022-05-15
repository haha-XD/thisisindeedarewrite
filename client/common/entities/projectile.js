import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'
import radians from '../utils/radians.js';
import Point from '../utils/point.js'

export class Projectile extends Entity {
    category = ENTITY_CATEGORY.projectiles;
    objType = this.constructor.name;
    doNotUpdate = true;
    rotate = true;
    hasNotHit = true;

    constructor({x, y, speed, size, lifetime, damage, direction, target}) {
        super(x, y, size, -1) //id is ALWAYS -1 because syncing is hard
        this.target = target;
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

    detectEnemyCollision(entity) {
        if (!entity) return false;
        if (Math.sqrt((entity.x - this.x)**2 + (entity.y-this.y)**2) < this.size) {
            return true;
        } else {
            return false;
        }
    }
} 