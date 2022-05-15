import { io } from "https://cdn.socket.io/4.3.0/socket.io.esm.min.js";

import * as h from './handlers/index.js'
import ClientManager from "./components/manager.js";
import waitUntil from './common/utils/waituntil.js';
import { CL_TICK_RATE } from './common/constants.js';
import Controller from './components/controller.js';
import Networking from './components/networking.js';
import Renderer from './components/renderer.js';

export default class GameClient {

    constructor() {
        this.socket = io();
        this.canvas = document.getElementById('gameCanvas');
        this.uiCanvas = document.getElementById('GameMenu');

        this.msgBox = document.getElementById('messageBox');
        this.sendMsgBtn = document.getElementById('sendMsgBtn');
        this.chatMessages = document.getElementById('chatMessages');
    }

    start() {
        waitUntil(() => this.socket.connected, () => {        
            this.socket.emit('startGame');
            this.sendMsgBtn.disabled = false;
            this.msgBox.disabled = false;

            this.attachSendMessage();

            this.networking = new Networking(this.socket);
            this.manager = new ClientManager(this.socket, this);
            this.controller = new Controller(this.canvas, this.manager); 
            this.renderer = new Renderer(this.canvas, this.uiCanvas);

            h.registerMessageHandler(this.manager, this.socket, this.chatMessages);
            h.registerBulletPatternHandler(this.manager, this.socket);
            h.registerClManagerHandlers(this.manager, this.socket, this.networking);
            h.registerUpdateHandler(this.networking, this.socket);
            this.interval = setInterval(
                function(self) { return function() { self.tick() } }(this), 
                CL_TICK_RATE
            );
        })
    }

    attachSendMessage() {
        (function(self) {
            const sendMsg = function() {
                self.socket.emit('message', { message : self.msgBox.value})
                self.msgBox.value = ""
            }
            self.sendMsgBtn.addEventListener('click', sendMsg)
        })(this)
    }

    tick() {
        this.manager.tick(this.networking.socket);
        this.sendTime(this.manager);
        this.networking.processServerMessages(this.manager);
        this.controller.processInputs(this.manager, this.networking);
        this.renderer.draw(this.manager, this.controller.rotation);
    }

    sendTime(manager) {
        if (!(manager.currentTick % 3)) {
            this.socket.emit('time', Date.now());
        }
    }
}