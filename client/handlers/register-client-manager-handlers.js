import { SV_UPDATE_RATE } from "../common/constants.js";

export function registerClManagerHandlers(manager, socket, networking) {
    const onWorldChange = function(playerId) {
        manager.totalBossHp = 0;
        manager.damageDone = 0;
        networking.svMsgQueue = []
        manager.clearEntities();
        manager.playerId = playerId;
    }

    const onStats = function({bossHp}) {
        manager.totalBossHp = bossHp;
        manager.inGame = true;
    }

    const onGameOver = function() {
        manager.inGame = false;
    }

    const onPlayerDisconnect = function(playerId) {
        manager.nonExistentPlayers.push(playerId);
        for (const data of networking.svMsgQueue) {
            delete data.state[playerId];
        }
        delete manager.players[playerId]
    }

    const onPong = function({pId, currentTick}) {
        const latency = Date.now() - manager.startTime;
        manager.extraTicks = Math.floor(latency / SV_UPDATE_RATE);
        manager.startTicks = currentTick;
        manager.playerId = pId;
    }

    socket.on('pong', onPong);
    socket.on('worldChange', onWorldChange);
    socket.on('playerDisconnect', onPlayerDisconnect);
    socket.on('stats', onStats);
    socket.on('gameOver', onGameOver);
 }