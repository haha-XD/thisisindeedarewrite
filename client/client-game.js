import * as h from './handlers/index.js'
import ClientManager from "./client-manager.js";
import registerClTicker from "./register-client-ticker.js";

export default class GameClient {
    constructor(canvas, UIcanvas, socket) {
        this.socket = socket;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.UIcanvas = UIcanvas;
        this.UIctx = UIcanvas.getContext('2d');

        const waitUntilConnected = setInterval(() => {
            if (!socket.connected) return;

            this.manager = new ClientManager(this.socket);
            
            h.registerClManagerHandlers(this.manager, socket);
            h.registerUpdateHandler(this.manager, socket)
            registerClTicker(this.manager)
            clearInterval(waitUntilConnected)
        }, 1000)
    }
}