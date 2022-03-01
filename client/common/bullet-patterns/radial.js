import { BulletPattern } from "./base-pattern.js";
import { Projectile } from "../entities/index.js";

export class Radial extends BulletPattern { 
    objType = this.constructor.name;

    constructor({x, y, projDesc, shotCount, direction, id=null}) {
        super(x, y, shotCount, projDesc, id);
        this.direction = direction;
    }

    createProjs(array) {
        this.projDesc.x = this.x;
        this.projDesc.y = this.y;
        for(let i = 0; i < this.shotCount; i++) {
            let bullet = new Projectile(this.projDesc)
            bullet.direction = this.direction + i * (360 / this.shotCount)
            array.push(bullet);
        }
    }
}
