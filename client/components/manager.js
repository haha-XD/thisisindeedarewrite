import { ENTITY_CATEGORY, SV_TICK_RATE } from "../common/constants.js";

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
          prone to issues and makes bullet pattern packets hard to implement*/
        projectiles : [] 
    };
    playerId;

    constructor(socket) {
        console.log('hi')
        socket.emit('ping');
    }

    tick(socket) {
        const nowTicks = Math.floor((Date.now()-this.startTime)/SV_TICK_RATE)
        const currentTick = this.startTicks + nowTicks + this.extraTicks;
        this.currentTick = currentTick;

        const nowTs = Date.now();
        this.dt = (nowTs - this.lastTs)/1000;
        this.lastTs = nowTs;

        let rmvArray = [] //because removing during iteration is scary.
        for (const projectile of this.projectiles) {
            const elapsedTime = Date.now() - projectile.creationTs
            const position = projectile.getPosition(elapsedTime);
            projectile.x = position.x;
            projectile.y = position.y;
            if(!projectile.tick(this, elapsedTime)) rmvArray.push(projectile);
            for (const enemy of Object.values(this.enemies)) {                
                if (projectile.detectEntityCollision(enemy) && 
                    projectile.target == ENTITY_CATEGORY.enemies) {
                    console.log('hit enemy!', enemy.id)
                    socket.emit('tryHit', {
                        target: enemy,
                        projectile: projectile
                    });
                }
            }
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