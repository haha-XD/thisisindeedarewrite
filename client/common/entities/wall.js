import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'

export class Wall extends Entity {
    category = ENTITY_CATEGORY.walls;
    objType = this.constructor.name;
    
    constructor({x, y, size}) {
        super(x, y, size)
    }
}