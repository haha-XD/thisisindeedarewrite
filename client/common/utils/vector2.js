import radians from "./radians.js";

export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;   
    }

    get magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    normalize(value) {
        if (this.magnitude == 0) return Vector2.ZERO();
        this.divide(this.magnitude);
        this.multiply(value);
        return this;
    }

    add(vector) {
        this.x += vector.x
        this.y += vector.y
        return this;
    }

    subtract(vector) {
        this.x -= vector.x
        this.y -= vector.y
        return this;
    }

    multiply(value) {
        if (value instanceof Vector2) {
            this.x *= value.x
            this.y *= value.y
        } else {
            this.x *= value
            this.y *= value
        }
        return this;
    }

    divide(value) {
        if (value instanceof Vector2) {
            this.x /= value.x
            this.y /= value.y
        } else {
            this.x /= value
            this.y /= value
        }
        return this;
    }

    static advance(angle, amount) {
        const vecX = Math.cos(radians(angle)) * amount;
        const vecY = Math.sin(radians(angle)) * amount;
        return new Vector2(vecX, vecY);
    }
    
    static ZERO() {
        return new Vector2(0, 0);
    }
}