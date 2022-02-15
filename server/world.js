import fs from 'fs';

import { TILE_SIZE } from '../client/common/constants.js';
import * as entityTypes from '../client/common/entities/index.js';

let wId = 0;

export class World {
    enemyAI = {};
    entities = {
        players : {},
        enemies : {},
        walls : {},
        projectiles : {}
    };
    worldSpawn = [0,0];

    constructor(worldName) {
        const worldData = JSON.parse(fs.readFileSync(`./server/worlds/${worldName}/world-data.json`, 'utf8'));
        
        this.loadMap(worldName, worldData['entityDict']);
        this.worldSpawn = worldData['spawn'];

        this.id = wId;
        wId++;
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
                    this.entities[entity.category][entity.id] = entity;
                }
            }
        }    
    }
}