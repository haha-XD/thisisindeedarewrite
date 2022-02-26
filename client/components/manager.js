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
        projectiles : {} //projectile id is never useful
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

        for (const projectile of Object.values(this.projectiles)) {
            const elapsedTime = Date.now() - projectile.creationTs
            if(!projectile.tick(this, elapsedTime)) delete this.projectiles[projectile.id]
            const position = projectile.getPosition(elapsedTime);
            projectile.x = position.x;
            projectile.y = position.y;
        }
    }

    get players() { return this.entities.players }
    get projectiles() { return this.entities.projectiles }
    get walls() { return this.entities.walls }
    get enemies() { return this.entities.enemies }
    get player() {
        return this.players[this.playerId];
    }
}