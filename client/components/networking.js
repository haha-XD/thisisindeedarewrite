import { SV_UPDATE_RATE } from "../common/constants.js";
import * as entityTypes from "../common/entities/index.js";

export default class Networking {
    inputAckNum = 0;
    svMsgQueue = [];
    pendingInputStates = [];
   
    constructor(socket) {
        this.socket = socket;
    }

    processServerMessages(manager) {
        while (true) {
            const msg = this.svMsgQueue.shift();
            if (!msg) break;

            Networking.updateState(manager, msg.state);
            this.lastAckNum = msg.inputAckNum;
            this.performServerReconciliation(manager);
        }
    }

    performServerReconciliation(manager) {
        this.pendingInputStates = this.pendingInputStates.filter(input => input.num > this.lastAckNum);
        if (this.pendingInputStates) {
            for (const input of this.pendingInputStates) {
                manager.player.applyInput(input.rot, input.inputs, Object.values(manager.walls));            
            }
        }
    }

    static updateState(manager, state) {
        for (let entity of Object.values(state)) {
            if (!manager.entities[entity.category][entity.id]) {
                let newEntity = new entityTypes[entity.objType](entity);   
                newEntity.positionBuffer = [];
                manager.entities[entity.category][entity.id] = newEntity;
            }
            if (entity.id == manager.playerId) {
                Object.assign(manager.player, entity);
            } 
            else if (!entity.doNotUpdate) {
                let localEntity = manager.entities[entity.category][entity.id];
                localEntity.positionBuffer.push({
                    ts: Date.now(),
                    x: entity.x,
                    y: entity.y
                })
                delete entity.x;
                delete entity.y;
                Object.assign(localEntity, entity);    
            }
        } 
    }

    static interpolateEntities(manager) {
        const renderTs = Date.now() - SV_UPDATE_RATE;
        for (const entityType of Object.values(manager.entities)) {
            for (let entity of Object.values(entityType)) {
                if (entity.doNotUpdate) continue;
                const b = entity.positionBuffer;
                while (b.length >= 2 && b[1].ts <= renderTs) {
                    b.shift();
                }
                if (b.length >= 2 && b[0].ts <= renderTs && renderTs <= b[1].ts) {
                    entity.x = b[0].x + (b[1].x - b[0].x) * (renderTs - b[0].ts) / (b[1].ts - b[0].ts);
                    entity.y = b[0].y + (b[1].y - b[0].y) * (renderTs - b[0].ts) / (b[1].ts - b[0].ts);
                }
            }
        }
    }
}