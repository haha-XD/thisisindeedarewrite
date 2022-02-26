import { SV_TICK_RATE } from '../../client/common/constants.js';
import World from './world.js';

export class Manager {
    currentTick = 0;
    startTime = Date.now();
    worlds = {};

    constructor(io) {
        this.io = io
    }

    tick() {
        this.currentTick = Math.floor((Date.now()-this.startTime)/SV_TICK_RATE)
        for (const world of Object.values(this.worlds)) {
            for (const enemy of Object.values(world.entities.enemies)) {
                enemy.tick(this);
            }
            world.updateChunks()
        }
    }

    createWorld(worldName) {
        const world = new World(worldName)
        this.worlds[world.id] = world;
    }

    stateNear(socket) {
        const p = socket.profile;
        const chunks = this.worlds[p.currentWorld].chunks;
        const nearChunks = World.getNearChunks(p.playerEntity.chunkLoc, chunks);
        return nearChunks;
    }
}