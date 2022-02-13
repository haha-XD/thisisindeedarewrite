import { DefaultDict } from "../client/common/helper.js";
import { World } from "./world.js";

export class Manager {
    tick = 0;
    worlds = {}

    createWorld(worldName) {
        const world = World.load_world(worldName)
        this.worlds[world.id] = world;
    }

    getChunks(worldName) {
        let chunks = new DefaultDict(Array);
        const entities = worlds[worldName].entities;
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
                nearChunks = nearChunks.concat(chunks[[chunkLoc[0]+nx, chunkLoc[1]+ny]]);
            }
        }
        return nearChunks
    }
}