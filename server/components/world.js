import fs from 'fs';

import { TILE_SIZE, CHUNK_SIZE } from '../../client/common/constants.js';
import * as entityTypes from '../../client/common/entities/index.js';
import Point from '../../client/common/utils/point.js';
import DefaultDict from '../../client/common/utils/defaultdict.js';

let wId = 0;

export default class World {
    enemyAI = {};
    entities = {
        players : {},
        enemies : {},
        walls : {}
    };
    chunks;

    constructor(worldName) {
        const worldData = JSON.parse(fs.readFileSync(`./server/worlds/${worldName}/world-data.json`, 'utf8'));
        
        this.worldName = worldName;
        this.loadEnemyAI(worldName);
        this.loadMap(worldName, worldData['entityDict']);
        this.worldSpawns = worldData['spawns'].map((coords) => new Point(coords[0], coords[1]));
        this.id = wId;
        wId++;
    }

    spawnPlayer(socket) {
        const worldSpawn = this.worldSpawns[Math.floor(Math.random() * this.worldSpawns.length)]
        const player = new entityTypes.Player({
            x: worldSpawn.x,
            y: worldSpawn.y,
            size: 32,
            speed: 500,
            hp: 1000,
            socketId: socket.id
        })
        player.name = socket.profile.playerName;
        this.players[player.id] = player;
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

    updateChunks() {
        let chunks = new DefaultDict(Array);
        const entities = this.entities;
        for (const entityType of Object.values(entities)) {
            for (const entity of Object.values(entityType)) {
                const chunkX = Math.trunc(entity.x / CHUNK_SIZE);
                const chunkY = Math.trunc(entity.y / CHUNK_SIZE);
                chunks[[chunkX, chunkY]].push(entity);
            }
        }
        this.chunks = chunks;
    }   

    static getNearChunks(chunkLoc, chunks) {
        let nearChunks = []
        for (let nx = -1; nx < 2; nx++) {
            for (let ny = -1; ny < 2; ny++) {
                nearChunks = nearChunks.concat(chunks[[chunkLoc.x+nx, chunkLoc.y+ny]]);
            }
        }
        return nearChunks
    }

    loadMap(mapName, entityDict) {
        const data = fs.readFileSync(`./server/worlds/${mapName}/map-data.txt`, 'utf8')
        for (const [y, line] of data.split(/\r?\n/).entries()) {
            for (const [x, char] of line.split('').entries()) {
                if (Object.keys(entityDict).includes(char)) {
                    let entityData = entityDict[char]
                    entityData.x = TILE_SIZE/2 + (TILE_SIZE * x);
                    entityData.y = TILE_SIZE/2 + (TILE_SIZE * y);
                    entityData.size = entityData.size || TILE_SIZE;
                    if (typeof entityData.ai == 'string') 
                    {
                        entityData.ai = this.enemyAI[entityData.ai];
                    }
                    const entity = new entityTypes[entityDict[char].entityType](entityData);
                    this.spawnEntity(entity);
                }
            }
        }    
    }
    
    loadEnemyAI(mapName) {
        const fileNames = fs.readdirSync(`./server/worlds/${mapName}/enemyAI`, 'utf8')
        for (let fileName of fileNames) {    
            const data = JSON.parse(fs.readFileSync(`./server/worlds/${mapName}/enemyAI/${fileName}`, 'utf8'));
            this.enemyAI[fileName.split('.')[0]] = data;
        }
    }

    sockets(io) {
        return Object.values(this.players).map(player => 
            io.sockets.sockets.get(player.socketId)
        ); 
    }
    get players() { return this.entities.players }
    get projectiles() { return this.entities.projectiles }
    get walls() { return this.entities.walls }
    get enemies() { return this.entities.enemies }
}