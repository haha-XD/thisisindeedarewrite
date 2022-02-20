import { CHUNK_SIZE } from "../constants.js";
import Point from "../utils/point.js";

let id = 0;

export class Entity {
    rotate = false;

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        //this.objType = subclass.classname        
        this.id = id;
        id++;
    }

    detectEntityCollision(entity) {
        if (!(this.right <= entity.left ||
              this.left >= entity.right ||
              this.bottom <= entity.top ||
              this.top >= entity.bottom)) {
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
    get loc() { return new Point(this.x, this.y) }
    get state() { return {...this}; } //strips away functions for sending over network 

    get top() { return this.y - this.size/2; }
    get bottom() { return this.y + this.size/2; }
    get left() { return this.x - this.size/2; }
    get right() { return this.x + this.size/2; }
    
    set top(y) { this.y = y + this.size/2 }
    set bottom(y) { this.y = y - this.size/2 }
    set left(x) { this.x = x + this.size/2 }
    set right(x) { this.x = x - this.size/2; }
}

