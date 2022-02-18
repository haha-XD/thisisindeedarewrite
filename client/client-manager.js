import { SV_TICK_RATE } from "./common/constants.js";
import * as entityTypes from "./common/entities/index.js";

export default class ClientManager {
    startTime = Date.now();
    extraTicks = 0;
    startTicks = 0;
    currentTick = 0;e
    entities = {
        players : {},
        enemies : {},
        walls : {},
        projectiles : {}
    };
    playerId;
    svMsgQueue = [];

    constructor(socket) {
        this.socket = socket;

        socket.emit('ping');
    }

    tick() {
        const nowTicks = Math.floor((Date.now()-this.startTime)/SV_TICK_RATE)
        this.currentTick = this.startTicks + nowTicks + this.extraTicks;
        console.log(this.currentTick)
    }
}