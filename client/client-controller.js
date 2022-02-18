export default class Controller {
    #lastTs = 0;
    keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE']
    keysPressed = {}
    
    constructor() {
        this.attachEventHandlers()
    }

    attachEventHandlers() {
        (function(self) {
            window.addEventListener('keydown', (e) => {
                if ()
                
            })
            window.addEventListener('keyup', (e) => {
                if([87, 83, 68, 65, 81, 69, 84].includes(e.keyCode)) {
                    self.keysPressed[e.keyCode] = false;
                }
            })    
        })(this);
    }
}