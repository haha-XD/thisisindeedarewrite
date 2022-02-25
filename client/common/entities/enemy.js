import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'

export class Enemy extends Entity {
    category = ENTITY_CATEGORY.enemies;
    objType = this.constructor.name;
    
    constructor({x, y, size, ai}) { 
        super(x, y, size)
        this.ai = ai;
    }

    tick() {
        
    }
}