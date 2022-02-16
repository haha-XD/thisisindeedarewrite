import { CHUNK_SIZE } from '../client/common/constants.js';
import DefaultDict from '../client/common/utils/defaultdict.js';
import { World } from './world.js';

export class Manager {
    tick = 0;
    worlds = {}

    constructor(io) {
        this.io = io
    }

    createWorld(worldName) {
        const world = new World(worldName)
        this.worlds[world.id] = world;
    }

    getChunks(wId) {
        let chunks = new DefaultDict(Array);
        const entities = this.worlds[wId].entities;
        for (const entityType of Object.values(entities)) {
            for (const entity of Object.values(entityType)) {
                const chunkX = Math.trunc(entity.x / CHUNK_SIZE);
                const chunkY = Math.trunc(entity.y / CHUNK_SIZE);
                chunks[[chunkX, chunkY]].push(entity);
            }
        }
        return chunks;
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

    stateNear(socket) {
        const p = socket.profile;
        const chunks = this.getChunks(p.currentWorld);
        const nearChunks = Manager.getNearChunks(p.playerEntity.chunkLoc, chunks);
        return nearChunks;
    }
}