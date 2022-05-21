import Point from "../common/utils/point.js";
import { FIRE_RATE, PLAYER_PROJ_DESC } from "../common/constants.js";
import { Projectile } from "../common/entities/projectile.js";

/*
client module that manages the receiving of input from the browser,
the storage of options relating to input, and the sending of inputs 
to the server.
*/
export default class Controller {
    #cmdNum = 0;
    svKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    clKeys = ['KeyQ', 'KeyE', 'KeyT', 'KeyL', 'KeyK']; // the server does not care about these keys
    keysPressed = {};
    rotation = 0;
    rotationSpeed = 200;
    mouseHolding = false;
    mousePos = new Point(0,0)
    lastShootTime = Date.now();
    mouseObj;

    constructor(canvas, manager) {
        this.canvas = canvas;
        this.manager = manager;

        this.attachKeyboardHandlers();
        this.attachMouseHandlers();
        this.attachClickHandler();
    }

    processInputs(manager, networking) {
        this.processKeyInputs(manager, networking);
        this.processMouseInputs(manager, networking);
    }

    processMouseInputs(manager, networking) {
        const msgBox = document.getElementById('messageBox');
        const sendBtn = document.getElementById('sendMsgBtn');
        if (this.mouseHolding && Date.now() - this.lastShootTime > FIRE_RATE && !manager.player.dead) {
            if (document.activeElement == msgBox || document.activeElement == sendBtn) return;
            this.lastShootTime = Date.now()
            const midX = this.canvas.width/2;
            const midY = this.canvas.height/2;
            const relativeX = this.mousePos.x - midX;
            const relativeY = this.mousePos.y - midY; 
            const angle = Math.atan2(relativeY, relativeX) * (180/Math.PI);
            
            let projDesc = PLAYER_PROJ_DESC;
            projDesc.direction = angle - this.rotation;
            projDesc.x = manager.player.x;
            projDesc.y = manager.player.y;
            const proj = new Projectile(projDesc);
            manager.projectiles.push(proj);
        }
    }

    processKeyInputs(manager, networking) {
        let tInputs = {}
        for (const key in this.keysPressed) {
            if (this.keysPressed[key]) {
                tInputs[key] = manager.dt;
            }
        }

        if (Object.keys(tInputs).length != 0) { //is not empty?
            this.clApplyInputs(tInputs, manager.dt)
            
            if (tInputs['KeyL']) {
                manager.clearEntities();    
            };
            if (tInputs['KeyK']) {
                tInputs['KeyW'] = "lol";
            }

            if (Object.keys(tInputs).filter((key) => this.svKeys.includes(key)).length) {
                const packagedInput = {
                    num: this.#cmdNum,
                    rot: this.rotation,
                    inputs: tInputs
                }
                networking.socket.emit('input', packagedInput);
                manager.player.applyInput(
                    this.rotation, 
                    tInputs,
                    Object.values(manager.walls)
                )
                networking.pendingInputStates.push(packagedInput);
                this.#cmdNum++;
            }
        }
    }
    

    clApplyInputs(inputs, dt) {
        if (inputs['KeyQ']) {
            this.rotation += this.rotationSpeed * dt;
        }
        if (inputs['KeyE']) {
            this.rotation -= this.rotationSpeed * dt;
        }
        if (inputs['KeyT']) {
            this.rotation = 0;
        }
    }

    attachKeyboardHandlers() {
        (function (self) {
            const msgBox = document.getElementById('messageBox');
            window.addEventListener('keydown', (e) => {
                if (document.activeElement == msgBox) return;
                if (self.keys.includes(e.code)) {
                    self.keysPressed[e.code] = true;
                }
            })
            window.addEventListener('keyup', (e) => {
                if (document.activeElement == msgBox) return;
                if (self.keys.includes(e.code)) {
                    self.keysPressed[e.code] = false;
                }
            })
        })(this);
    }

    attachMouseHandlers() {
        (function (self) {;
            function getCursorPosition(canvas, event) {
                if (event) {
                    const rect = canvas.getBoundingClientRect()
                    self.mousePos.x = event.clientX - rect.left
                    self.mousePos.y = event.clientY - rect.top    
                }
            }			
            function mouseInterval() {
                let setIntervalId = setInterval(function() {
                    if (!self.mouseHolding) clearInterval(setIntervalId);
                        getCursorPosition(self.canvas, self.mouseObj);
                }, 50); //set your wait time between consoles in milliseconds here
            }
            window.addEventListener('mousedown', () => {
                self.mouseHolding = true;
                mouseInterval();
            })
            window.addEventListener('mouseup', () => {
                self.mouseHolding = false;
                mouseInterval();
            })
            window.addEventListener('mouseleave', () => {
                self.mouseHolding = false;
                mouseInterval();
            })
            self.canvas.addEventListener('mousemove', (e) => {
                self.mouseObj = e;
            })
        })(this);
    }    

    attachClickHandler(manager) {
        (function (self) {
            function isInside(pos, rect){
                return pos.x > rect.x && 
                       pos.x < rect.x + rect.width && 
                       pos.y < rect.y + rect.height && 
                       pos.y > rect.y;
            }

            function getCursorPosition(canvas, event) {
                const rect = canvas.getBoundingClientRect()
                return {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };
            }			

            window.addEventListener('click', function(event) {
                let mousePos = getCursorPosition(self.canvas, event);
                for (const rect of self.manager.buttonRects) {
                    if (isInside(mousePos, rect) && rect.onClick) {
                        rect.onClick(self.manager)
                    }	
                }
            }, false);
        })(this);
    }
    
    get keys() {
        return this.clKeys.concat(this.svKeys)
    }
}