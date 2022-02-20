export default class Controller {
    #cmdNum = 0;
    svKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    clKeys = ['KeyQ', 'KeyE', 'KeyT']; // the server does not care about these keys
    keysPressed = {};
    rotation = 0;
    rotationSpeed = 200;
    
    constructor() {
        this.attachEventHandlers();
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
                    Object.values(manager.entities.walls)
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

    attachEventHandlers() {
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
    
    get keys() {
        return this.clKeys.concat(this.svKeys)
    }
}