let wId = 0;

const entityDict = {
    '#' : entityTypes.Wall
}

export class World {
    enemyAI = {}
    entities = {
        players : {},
        enemies : {},
        walls : {},
        projectiles : {}
    };

    constructor(worldName) {
        this.load_map(worldName);
        
        this.id = wId
        wId++
    }

    load_map(mapName) {
        const data = fs.readFileSync(`./data/${mapName}/mapData.txt`, 'utf8')
        for (const [y, line] of data.split(/\r?\n/).entries()) {
            for (const [x, char] of line.split('').entries()) {
                if (Object.keys(entityDict).includes(char)) {
                    const entity = new entityDict[char](
                        TILE_SIZE/2 + (TILE_SIZE * x), 
                        TILE_SIZE/2 + (TILE_SIZE * y), 
                        TILE_SIZE
                    )
                    this.entities[entity.type][entity.id] = entity;
                }
            }
        }    
    }
}