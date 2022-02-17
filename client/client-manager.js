import { SV_TICK_RATE } from "./common/constants.js";

export default class ClientManager {
    startTime = Date.now();
    extraTicks = 0;
    startTicks = 0;
    currentTick = 0;
    playerId;
    entities = {
        players : {},
        enemies : {},
        walls : {},
        projectiles : {}
    };
    svMsgQueue = [];

    constructor(socket) {
        this.socket = socket;

        socket.emit('ping');
    }

    tick() {
        const nowTicks = Math.floor((Date.now()-this.startTime)/SV_TICK_RATE)
        this.currentTick = this.startTicks + nowTicks + this.extraTicks;
        console.log(this.currentTick)

        this.processServerMessages();
    }

    processServerMessages() {
        while (true) {
            const msg = this.svMsgQueue.shift()
            if (!msg) break;

            this.updateState(msg.state);
        }
    }

    updateState(state) {
        for (const entity of Object.values(state)) {
            if (!this.entities[entity.category][entity.id]) {
                console.log(entity)                   
            }
        } 
    }
}