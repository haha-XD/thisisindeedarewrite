import { ENTITY_CATEGORY, PLAYER_PROJ_DESC, SV_TICK_RATE } from "../common/constants.js";

export default class ClientManager {
    chatMsgs = [];
    startTime = Date.now();
    lastTs = Date.now()
    dt = 0;
    extraTicks = 0;
    startTicks = 0;
    currentTick = 0;
    damageDone = 0;
    damagedEnemies = {}
    totalBossHp = 0;
    inGame = false;
    entities = {
        players : {},
        enemies : {},
        walls : {},
        /*projectile id is never useful + syncing ids is VERY 
          prone to issues and makes bullet pattern packets hard to implement*/
        projectiles : [] 
    };
    playerId;
    tempHp = 0;
    renderHp = 0;
    nonExistentPlayers = [];
    buttonRects = [
        {
            colour : "#750800",
            x : 935, 
            y : 700,
            width : 150,
            height : 35,
            text : "Main Menu",
            textColour : 'white',
            font : "20px Lucida Console",
            textXOffset : 50,
            textYOffset : 25,
            onClick : this.goToMenu
        }
    ];

    constructor(socket, gameClient) {
        this.gameClient = gameClient
        socket.emit('ping');
    }

    goToMenu(self) {
        window.location.reload();
    }

    clearEntities() {
        this.entities = {
            players : {},
            enemies : {},
            walls : {},
            projectiles : [] 
        };
    }

    tick(socket) {
        let rmvArray2 = []
        for (const entityId of this.nonExistentPlayers) {
            if (this.players[entityId]) {
                delete this.players[entityId];
                rmvArray2.push(entityId)
            }
        }
        this.nonExistentPlayers = this.nonExistentPlayers.filter((element) => !rmvArray2.includes(element));

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
                    socket.emit('tryHit', {
                        target: enemy
                    });
                    if (enemy.hp >= 0 && !enemy.invincible) {
                        this.damageDone += PLAYER_PROJ_DESC.damage;
                        enemy.damagedTicks = 20;
                        rmvArray.push(projectile);
                    }
                }
            }
            if (projectile.detectCircleCollision(this.player) && 
                projectile.target == ENTITY_CATEGORY.players) {
                rmvArray.push(projectile)
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