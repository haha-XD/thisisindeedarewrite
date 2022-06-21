import { RENDER_OPTIONS, ENTITY_CATEGORY, PLAYER_PROJ_DESC } from "../../client/common/constants.js";

export function registerBulletAckHandler(manager, socket) {
    const onTryHit = function({target}) {
        if (target.invincible) return; 
        let enemy = manager.worlds[socket.profile.currentWorld].enemies[target.id];
        if (!enemy) return;
        enemy.hp -= PLAYER_PROJ_DESC.damage;
        if (enemy.hp <= 0) {
            enemy.dead = true;
        }
        socket.profile.damageDone += PLAYER_PROJ_DESC.damage;
    }

    const onBulletAck = function({id, clientTime}) {
        const p = socket.profile;
        const bp = p.bulletPatterns[id];
        delete p.bulletPatterns[id];
        let bulletArray = [];
        bp.createProjs(bulletArray);
        p.bullets.push({
            creationTs : clientTime, //IMPORTANT: THIS IS CLIENT TIME!!!
            bullets : bulletArray
        })
    }

    const onTime = function(clientTime) {
        //COLLISION CHECK
        const p = socket.profile;
        const world = manager.worlds[p.currentWorld];
        if (Date.now() - p.lastTimePacket > 6000 && p.lastTimePacket != 0 && !RENDER_OPTIONS.DEBUG_MODE) {
            socket.emit('message', {
                playerName : "[SERVER]",
                message : "<em>You were disconnected because you took too long to send your time packet.</em>"
            })
            socket.disconnect();
        }
        p.lastTimePacket = Date.now(); 
        for (const bulletsObj of p.bullets) {
            const creationTs = bulletsObj.creationTs;
            let bullets = bulletsObj.bullets;
            let rmvArray = [] //because removal during iteration is scary.
            for (let bullet of bullets) {
                const elapsedTime = clientTime - creationTs;
                const pos = bullet.getPosition(elapsedTime)
                bullet.x = pos.x;
                bullet.y = pos.y;
                if (!bullet.tick(world, elapsedTime)) rmvArray.push(bullet); 
                if (bullet.detectCircleCollision(p.playerEntity) && 
                    bullet.target==ENTITY_CATEGORY.players) {
                    p.playerEntity.hp -= bullet.damage;
                    rmvArray.push(bullet);
                }
                if (p.playerEntity.hp <= 0 && !p.playerEntity.dead) {
                    p.playerEntity.dead = true;
                    manager.io.emit('message', {
                        playerName : '[SERVER]',
                        message : `<em>${p.playerEntity.name} has died. ${manager.alivePlayersInGame.length} players remain.</em>`
                    });
                }
            }
            bulletsObj.bullets = bullets.filter(element => !rmvArray.includes(element))
        }
    }

    console.log('[SERVER] loaded bullet handler for', socket.profile.playerName)

    socket.on('tryHit', onTryHit);
    socket.on('ackBulletPattern', onBulletAck);
    socket.on('time', onTime);
}