import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'

export class Wall extends Entity {
    category = ENTITY_CATEGORY.walls;
    objType = this.constructor.name;
    rotate = true;
    
    constructor({x, y, size, id=null}) {
        super(x, y, size, id)
    }
}