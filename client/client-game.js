import * as h from './handlers/index.js'
import ClientManager from "./components/manager.js";
import waitUntil from './common/utils/waituntil.js';
import { CL_TICK_RATE } from './common/constants.js';
import Controller from './components/controller.js';
import Networking from './components/networking.js';
import Renderer from './components/renderer.js';

export default class GameClient {
    constructor(canvas, UIcanvas, socket) {
        this.socket = socket;
        this.canvas = canvas;
        this.UIcanvas = UIcanvas;

        waitUntil(() => this.socket.connected, () => {
            this.controller = new Controller(); 
            this.networking = new Networking(socket);
            this.manager = new ClientManager(socket);
            this.renderer = new Renderer(this.canvas, this.UIcanvas);

            h.registerClManagerHandlers(this.manager, socket);
            h.registerUpdateHandler(this.networking, socket);
            setInterval(
                function(self) { return function() { self.tick() } }(this), 
                CL_TICK_RATE
            );
        })
    }

    tick() {
        this.manager.tick();
        this.networking.processServerMessages(this.manager);
        this.controller.processInputs(this.manager, this.networking);
        Networking.interpolateEntities(this.manager);
        this.renderer.draw(this.manager, this.controller.rotation);
    }
}