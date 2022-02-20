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
        projectiles : {}
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
    }

    get player() {
        return this.entities.players[this.playerId];
    }
}