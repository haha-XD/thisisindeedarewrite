import { BulletPattern } from "./base-pattern.js";
import { Projectile } from "../entities/index.js";

export class Radial extends BulletPattern { 
    objType = this.constructor.name;

    constructor({x, y, projDesc, shotCount, direction}) {
        super(x, y, shotCount, projDesc);
        this.direction = direction;
    }

    createProjs(manager) {
        this.projDesc.x = this.x;
        this.projDesc.y = this.y;
        for(let i = 0; i < this.shotCount; i++) {
            let bullet = new Projectile(this.projDesc)
            bullet.direction = this.direction + i * (360 / this.shotCount)
            manager.projectiles.push(bullet);
        }
    }
}
