import { SV_TICK_RATE } from '../../client/common/constants.js';
import World from './world.js';

export class Manager {
    currentTick = 0;
    startTime = Date.now();
    lastTs = Date.now();
    worlds = {};

    constructor(io) {
        this.io = io
    }

    tick() {
        const nowTs = Date.now();
        this.dt = (nowTs - this.lastTs)/1000;
        this.lastTs = nowTs;
        
        this.currentTick = Math.floor((Date.now()-this.startTime)/SV_TICK_RATE)
        for (const w in this.worlds) {
            for (const e of Object.values(this.worlds[w].enemies)) {
                e.tick(this, w);
            }
            this.worlds[w].updateChunks()
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