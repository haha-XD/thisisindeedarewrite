export function registerBulletAckHandler(manager, socket) {
    const onBulletAck = function({id, clientTime}) {
        const p = socket.profile;
        const bp = p.bulletPatterns[id];
        let bulletArray = []
        bp.createProjs(bulletArray);
        p.bullets.push({
            creationTs : clientTime, //IMPORTANT: THIS IS CLIENT TIME!!!
            bullets : bulletArray
        })
    }

    const onTime = function(clientTime) {
        //COLLISION CHECK
        const p = socket.profile;
        for (const bulletsObj of p.bullets) {
            const creationTs = bulletsObj.creationTs;
            const bullets = bulletsObj.bullets;
            for (let bullet of bullets) {
                const elapsedTime = clientTime - creationTs;
                const pos = bullet.getPosition(elapsedTime)
                bullet.x = pos.x;
                bullet.y = pos.y;
                if (bullet.detectEntityCollision(p.playerEntity)) {
                    p.playerEntity.hp -= bullet.damage;
                }
            }
        }
    }

    socket.on('ackBulletPattern', onBulletAck);
    socket.on('time', onTime);
}