import { BulletPattern } from "./base-pattern";
import { Projectile } from "../entities/index.js";

export class Radial extends BulletPattern { 
    objType = this.constructor.name;

    constructor({x, y, projDesc, shotCount, direction}) {
        super(x, y, projDesc);
        this.shotCount = shotCount;
        this.direction = direction;
    }

    createProjs(manager) {
        for(let i = 0; i < this.shotCount; i++) {
            let bullet = new Projectile(this.projDesc)
            bullet.direction = this.direction + i * (360 / this.shotCount)
            manager.entities.projectiles.push(bullet);
        }
    }
}
