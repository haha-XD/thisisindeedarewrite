import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'
import Vector2 from '../utils/vector2.js';
import * as bulletPatterns from '../bullet-patterns/index.js';

export class Enemy extends Entity {
    category = ENTITY_CATEGORY.enemies;
    objType = this.constructor.name;
    timers = {shootTimer: {timer: 0}};
    dead = false;
    damaged = false;

    constructor({x, y, size, speed, ai, hp, invincible, boss, id=null}) { 
        super(x, y, size, id);
        this.speed = speed;
        this.ai = ai;
        this.hp = hp;
        this.maxhp = hp;
        this.invincible = invincible;
        this.boss = boss;
        this.aiState = ai.defaultState;
    }
    
    closestPlayer(playerEntities) {
        let min = Infinity
        let player;
        for (let p of playerEntities) {
            if (p.dead) continue;
            let dist = Math.sqrt((p.x-this.x)**2+(p.y-this.y)**2);
            if (dist < min) {
                min = dist;
                player = p;
            }
        }            
        if (!player) return;
        
        const angle = Math.atan2(
            player.y-this.y, 
            player.x-this.x
        ) * 180/Math.PI;

        return {
            distance: min,
            angle: angle,
            closestPlayer: player
        };
    }

    tick(manager, worldName) {
        const worldObj = manager.worlds[worldName];
        const playerEntities = Object.values(worldObj.players);
        if (!playerEntities.length) return; 
        const closest = this.closestPlayer(playerEntities)
        
        for (const timer in this.timers) this.timers[timer].timer -= 1;
        if (this.timers.shootTimer.timer <= -100) this.timers.shootTimer.timer = 0

        for (const bhv of this.ai.states[this.aiState].behaviour) {
            const args = bhv.split(' ');
            this[args[0]](args, manager, closest, worldObj);
        }
    }

    chase(args, manager, closest, world) {
        if (!closest) return;
        const movementVec = Vector2.fromDirection(closest.angle, this.speed * manager.dt);
        this.x += movementVec.x;
        this.y += movementVec.y;
    }

    stateChangeTime(args, manager, closest, world) {
        const timerName = args[1];
        const timer = parseInt(args[2]);
        const stateChange = args[3] 
        if (!this.timers[timerName]) {   
            this.timers[timerName] = {
                timer: timer,
                stateChange: stateChange
            }
        }
        else if (this.timers[timerName].timer <= 0) {
            this.aiState = stateChange;
            delete this.timers[timerName];
        }
    }

    shoot(args, manager, closest, world) {
        const patternName = args[1];
        const interval = args[2];

        if (!(this.timers.shootTimer.timer % interval == 0)) return;
        let p = this.ai.projectiles[patternName];
        p.x = this.x;
        p.y = this.y;
        const bp = new bulletPatterns[p.type](p);
        for (const socket of world.sockets(manager.io)) {
            socket.emit('bulletPattern', bp.state);
            socket.profile.bulletPatterns[bp.id] = bp;
        }
    }

    shootClosest(args, manager, closest, world) {
        if (!closest) return;
        const patternName = args[1];
        const interval = args[2];

        if (!(this.timers.shootTimer.timer % interval == 0)) return;
        let p = this.ai.projectiles[patternName];
        p.x = this.x;
        p.y = this.y;
        p.direction = closest.angle;
        const bp = new bulletPatterns[p.type](p);
        for (const socket of world.sockets(manager.io)) {
            socket.emit('bulletPattern', bp.state);
            socket.profile.bulletPatterns[bp.id] = bp;
        }
    }
    
    get state() { 
        return {
            x: this.x,
            y: this.y,
            size: this.size,
            category: this.category,
            objType: this.objType
        }
    }   
}