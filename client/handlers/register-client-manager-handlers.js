import { SV_UPDATE_RATE } from "../common/constants.js";

export function registerClManagerHandlers(manager, socket, networking) {
    const onWorldChange = function(playerId) {
        networking.svMsgQueue = []
        manager.clearEntities();
        manager.playerId = playerId;
    }

    const onPlayerDisconnect = function(playerId) {
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
 }