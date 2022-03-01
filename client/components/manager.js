import { SV_TICK_RATE } from "../common/constants.js";

export default class ClientManager {
    startTime = Date.now();
    lastTs = Date.now()
    dt = 0;
    extraTicks = 0;
    startTicks = 0;
    currentTick = 0;
    entities = {
        players : {},
        enemies : {},
        walls : {},
        /*projectile id is never useful + syncing ids is VERY 
          prone to issues and makes bullet pattern packets hard to impelement*/
        projectiles : [] 
    };
    playerId;

    constructor(socket) {
        socket.emit('ping');
    }

    tick() {
        const nowTicks = Math.floor((Date.now()-this.startTime)/SV_TICK_RATE)
        const currentTick = this.startTicks + nowTicks + this.extraTicks;
        this.currentTick = currentTick;

        const nowTs = Date.now();
        this.dt = (nowTs - this.lastTs)/1000;
        this.lastTs = nowTs;

        let rmvArray = [] //because removing during iteration is scary.
        for (const projectile of this.projectiles) {
            const elapsedTime = Date.now() - projectile.creationTs
            if(!projectile.tick(this, elapsedTime)) rmvArray.push(projectile);
            const position = projectile.getPosition(elapsedTime);
            projectile.x = position.x;
            projectile.y = position.y;
        }
        this.entities.projectiles = this.projectiles.filter(element => !rmvArray.includes(element));
    }

    get players() { return this.entities.players }
    get projectiles() { return this.entities.projectiles }
    get walls() { return this.entities.walls }
    get enemies() { return this.entities.enemies }
    get player() {
        return this.players[this.playerId];
    }
}