import Point from "../common/utils/point.js";

export default class Controller {
    #cmdNum = 0;
    svKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    clKeys = ['KeyQ', 'KeyE', 'KeyT']; // the server does not care about these keys
    keysPressed = {};
    rotation = 0;
    rotationSpeed = 200;
    mouseHolding = false;
    mousePos = new Point(0,0)
    mouseObj;

    constructor(canvas) {
        this.canvas = canvas;

        this.attachKeyboardHandlers();
        this.attachMouseHandlers();
    }

    processInputs(manager, networking) {
        let tInputs = {}
        for (const key in this.keysPressed) {
            if (this.keysPressed[key]) {
                tInputs[key] = manager.dt;
            }
        }

        const inputKeys = Object.keys(tInputs);
        if (inputKeys.length != 0) { //is not empty?
            this.clApplyInputs(tInputs, manager.dt);

            if (inputKeys.filter((key) => this.svKeys.includes(key)).length) {
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
            window.addEventListener('keydown', (e) => {
                if (self.keys.includes(e.code)) {
                    self.keysPressed[e.code] = true;
                }
            })
            window.addEventListener('keyup', (e) => {
                if (self.keys.includes(e.code)) {
                    self.keysPressed[e.code] = false;
                }
            })
        })(this);
    }

    attachMouseHandlers() {
        (function (self) {
            function getCursorPosition(canvas, event) {
                const rect = canvas.getBoundingClientRect()
                self.mousePos.x = event.clientX - rect.left
                self.mousePos.y = event.clientY - rect.top
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
                console.log(self.mousePos);
            })
        })(this);
    }
    
    get keys() {
        return this.clKeys.concat(this.svKeys)
    }
}