import radians from "./radians.js";

export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    rotate(angle) {
        this.x = this.x * Math.cos(radians(angle)) - this.y * Math.sin(radians(angle));
        this.x = this.x * Math.sin(radians(angle)) + this.y * Math.cos(radians(angle));
        return this;
    }
}