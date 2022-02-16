import fs from 'fs';

import { TILE_SIZE } from '../client/common/constants.js';
import * as entityTypes from '../client/common/entities/index.js';
import Point from '../client/common/utils/point.js';

let wId = 0;

export class World {
    enemyAI = {};
    entities = {
        players : {},
        enemies : {},
        walls : {},
        projectiles : {}
    };

    constructor(worldName) {
        const worldData = JSON.parse(fs.readFileSync(`./server/worlds/${worldName}/world-data.json`, 'utf8'));
        
        this.loadMap(worldName, worldData['entityDict']);
        this.worldSpawn = new Point(worldData['spawn'][0], worldData['spawn'][1]);

        this.id = wId;
        wId++;
    }

    spawnPlayer(socket) {
        const player = new entityTypes.Player({
            x: this.worldSpawn.x,
            y: this.worldSpawn.y,
            size: 32,
            speed: 5,
            socketId: socket.id
        })
        this.entities.players[player.id] = player;
        return player;
    }

    deleteEntity(id) {
        for (const entities of Object.values(this.entities)) {
            delete entities[id];
        }
    }

    spawnEntity(entity) {
        this.entities[entity.category][entity.id] = entity;
    }

    loadMap(mapName, entityDict) {
        const data = fs.readFileSync(`./server/worlds/${mapName}/map-data.txt`, 'utf8')
        for (const [y, line] of data.split(/\r?\n/).entries()) {
            for (const [x, char] of line.split('').entries()) {
                if (Object.keys(entityDict).includes(char)) {
                    let entityData = entityDict[char]
                    entityData.x = TILE_SIZE/2 + (TILE_SIZE * x);
                    entityData.y = TILE_SIZE/2 + (TILE_SIZE * y);
                    entityData.size = TILE_SIZE;

                    const entity = new entityTypes[entityDict[char].entityType](entityData);
                    this.spawnEntity(entity);
                }
            }
        }    
    }
}