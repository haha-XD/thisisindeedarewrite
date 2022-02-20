import radians from "./radians.js";

export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    rotate(angle) {
        const rotX = this.x * Math.cos(radians(angle)) - this.y * Math.sin(radians(angle));
        const rotY = this.x * Math.sin(radians(angle)) + this.y * Math.cos(radians(angle));
        this.x = rotX;
        this.y = rotY;
        return this;
    }

    add(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }
}