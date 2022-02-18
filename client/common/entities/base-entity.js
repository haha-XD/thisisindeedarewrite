import { CHUNK_SIZE } from "../constants.js";
import Point from "../utils/point.js";

let id = 0;

export class Entity {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        //this.objType = subclass.classname        
        this.id = id;
        id++;
    }

    detectEnemyCollision(entity) {
        if (!(this.right < entity.left ||
              this.left > entity.right ||
              this.bottom < entity.top ||
              this.top > entity.bottom)) {
            return true;
        } else {
            return false;
        }
    }

    get chunkLoc() { 
        return new Point(
            Math.trunc(this.x/CHUNK_SIZE),
            Math.trunc(this.y/CHUNK_SIZE)
        ); 
    } 
    get state() { return {...this}; } //strips away functions for sending over network 

    get top() { return this.y - this.size; }
    get bottom() { return this.y + this.size; }
    get left() { return this.x - this.size; }
    get right() { return this.x + this.size; }
}

