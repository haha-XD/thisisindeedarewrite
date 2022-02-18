import { Entity } from './base-entity.js'
import { ENTITY_CATEGORY } from '../constants.js'
import Vector2 from '../utils/vector2.js';

export class Player extends Entity {
    category = ENTITY_CATEGORY.players;
    objType = this.constructor.name;
    
    constructor({x, y, size, speed, socketId}) {
        super(x, y, size);
        this.speed = speed;
        this.socketId = socketId;
    }

    applyInput(rot, inputs, wallEntities) {
        movementVec = Vector2.ZERO;
        if (inputs[87] && inputs[87] <= 0.3) { //w 
            movementVec.add(Vector2.advance(-rot+90, -inputs[87]))
        }
        if (inputs[83] && inputs[83] <= 0.3) { //s
            movementVec.add(Vector2.advance(-rot+90, inputs[87]))
        }
        if (inputs[68] && inputs[68] <= 0.3) { //d
            movementVec.add(Vector2.advance(-rot, inputs[87]))
        }
        if (inputs[65] && inputs[65] <= 0.3) { //a
            movementVec.add(Vector2.advance(-rot, -inputs[87]))
        }
        movementVec.normalize(this.speed);
        
        this.y += movementVec.y;
        for (let wallEntity of wallEntities) {
            if (this.detectEntityCollision(wallEntity)) {
                if (movementVec.y > 0) {
                    this.y = this.top - this.size/2 - 1
                }
                if (movementVec.y < 0) {
                    this.y = this.bottom + this.size/2 + 1
                }
            }    
        }
        this.x += movementVec.x;
        for (let wallEntity of wallEntities) {
            if (this.detectEntityCollision(wallEntity)) {
                if (movementVec.x > 0) {
                    this.x = this.left - this.size/2 - 1
                }
                if (movementVec.x < 0) {
                    this.x = this.left + this.size/2 + 1
                }
            }    
        }
    }
}