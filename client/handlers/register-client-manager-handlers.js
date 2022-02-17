import { SV_UPDATE_RATE } from "../common/constants.js";

export function registerClManagerHandlers(manager, socket) {
    const onPong = function({pId, currentTick}) {
        const latency = Date.now() - manager.startTime;
        manager.extraTicks = Math.floor(latency / SV_UPDATE_RATE);
        manager.startTicks = currentTick;
        manager.playerId = pId;
    }

    socket.on('pong', onPong)
 }