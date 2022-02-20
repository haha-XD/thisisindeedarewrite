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
        let movementVec = Vector2.ZERO();
        if (inputs['KeyW'] && inputs['KeyW'] <= 0.3) { //w 
            movementVec.add(Vector2.advance(-rot+90, -inputs['KeyW']))
        }
        if (inputs['KeyS'] && inputs['KeyS'] <= 0.3) { //s
            movementVec.add(Vector2.advance(-rot+90, inputs['KeyS']))
        }
        if (inputs['KeyD'] && inputs['KeyD'] <= 0.3) { //d
            movementVec.add(Vector2.advance(-rot, inputs['KeyD']))
        }
        if (inputs['KeyA'] && inputs['KeyA'] <= 0.3) { //a
            movementVec.add(Vector2.advance(-rot, -inputs['KeyA']))
        }
        movementVec.normalize(this.speed).divide(100).fix();
        this.x += movementVec.x;
        for (const wallEntity of wallEntities) {
            if (this.detectEntityCollision(wallEntity)) {
                if (movementVec.x > 0) {
                    this.right = wallEntity.left
                }
                if (movementVec.x < 0) {
                    this.left = wallEntity.right
                }
            }    
        }
        this.y += movementVec.y;
        for (const wallEntity of wallEntities) {
            if (this.detectEntityCollision(wallEntity)) {
                if (movementVec.y > 0) {
                    this.bottom = wallEntity.top
                }
                if (movementVec.y < 0) {
                    this.top = wallEntity.bottom
                }
            }    
        }
    }
}