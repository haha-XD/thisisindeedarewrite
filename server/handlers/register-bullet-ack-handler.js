import { ENTITY_CATEGORY } from "../../client/common/constants.js";

export function registerBulletAckHandler(manager, socket) {
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
                if (bullet.detectEntityCollision(p.playerEntity) && 
                    bullet.target==ENTITY_CATEGORY.players) {
                    p.playerEntity.hp -= bullet.damage;
                }
            }
            bulletsObj.bullets = bullets.filter(element => !rmvArray.includes(element))
        }
    }

    console.log('[SERVER] loaded bullet handler for', socket.profile.playerName)

    socket.on('ackBulletPattern', onBulletAck);
    socket.on('time', onTime);
}