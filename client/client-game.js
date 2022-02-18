import * as h from './handlers/index.js'
import ClientManager from "./client-manager.js";
import registerClTicker from "./register-client-ticker.js";
import waitUntil from './common/utils/waituntil.js';
import { CL_TICK_RATE } from './common/constants.js';
import Controller from './client-controller.js';

export default class GameClient {
    constructor(canvas, UIcanvas, socket) {
        this.socket = socket;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.UIcanvas = UIcanvas;
        this.UIctx = UIcanvas.getContext('2d');

        waitUntil(() => this.socket.connected, () => {    
            this.manager = new ClientManager(this.socket);
            this.controller = new Controller(); 
            
            h.registerClManagerHandlers(this.manager, socket);
            h.registerUpdateHandler(this.manager, socket);
            setInterval(this.tick, CL_TICK_RATE);
        })
    }

    tick() {
        this.manager.tick()
        this.processServerMessages()
        this.controller.processInputs()
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
                let localEntity = new entityTypes[entity.objType](entity);                   
                localEntity.id = entity.id
                this.manager.entities[entity.category][entity.id] = localEntity;
            }
        } 
    }
}