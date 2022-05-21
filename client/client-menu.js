import { CL_TICK_RATE, RENDER_OPTIONS } from "./common/constants.js"
import GameClient from "./client-game.js";

export default class GameMenu {
    gameStarted = false;
    currentMenu = 'mainMenu';
    buttonRects = {
        'mainMenu' : [
            {
                colour : "white",
                x : 635, 
                y : 300,
                width : 0,
                height : 0,
                text : "DODGE GAME",
                textColour : '#750800',
                font : "100px Lucida Console",
                textXOffset : 50,
                textYOffset : 35
            },
            {
                colour : '#750800',
                x : 490, 
                y : 500,
                width : 300,
                height : 50,
                text : "PLAY",
                textColour : "white",
                font : "30px Lucida Console",
                textXOffset : 110,
                textYOffset : 35,
                onClick : this.startGame
            },
            {
                colour : '#750800',
                x : 490, 
                y : 575,
                width : 300,
                height : 50,
                text : "OPTIONS",
                textColour : "white",
                font : "30px Lucida Console",
                textXOffset : 80,
                textYOffset : 35,
                onClick : this.changeOptions
            }
        ],
        'optionsMenu' : [
            {
                colour : "white",
                x : 635, 
                y : 150,
                width : 0,
                height : 0,
                text : "OPTIONS",
                textColour : '#750800',
                font : "75px Lucida Console",
                textXOffset : 50,
                textYOffset : 35
            },
            {
                colour : '#750800',
                x : 335, 
                y : 200,
                width : 600,
                height : 5,
            },
            {
                colour : "white",
                x : 500, 
                y : 245,
                width : 0,
                height : 0,
                text : "3D WALLS",
                textColour : '#750800',
                font : "40px Lucida Console",
                textXOffset : 50,
                textYOffset : 35
            },
            {
                id : "toggledspecs",
                colour : "#750800",
                x : 800, 
                y : 235,
                width : 70,
                height : 55,
                text : " ",
                textColour : 'white',
                font : "50px Lucida Console",
                textXOffset : 50,
                textYOffset : 45,
                onClick : this.toggleLowspec
            },
            {
                id : "toggleddebug",
                colour : "#750800",
                x : 800, 
                y : 315,
                width : 70,
                height : 55,
                text : " ",
                textColour : 'white',
                font : "50px Lucida Console",
                textXOffset : 50,
                textYOffset : 45,
                onClick : this.toggleDebug
            },
            {
                colour : "white",
                x : 500, 
                y : 325,
                width : 0,
                height : 0,
                text : "DEBUG MODE",
                textColour : '#750800',
                font : "40px Lucida Console",
                textXOffset : 50,
                textYOffset : 35
            },
            {
                colour : "white",
                x : 500, 
                y : 405,
                width : 0,
                height : 0,
                text : "HEALTHBAR FREEZE",
                textColour : '#750800',
                font : "40px Lucida Console",
                textXOffset : 50,
                textYOffset : 35
            },
            {
                id : "toggleLevel",
                colour : '#750800',
                x : 800, 
                y : 395,
                width : 165,
                height : 55,
                text : "HIGH",
                textColour : "white",
                font : "30px Lucida Console",
                textXOffset : 80,
                textYOffset : 40,
                onClick: this.changeHealthFreeze
            },
            {
                colour : '#750800',
                x : 440, 
                y : 575,
                width : 400,
                height : 50,
                text : "BACK TO MAIN MENU",
                textColour : "white",
                font : "30px Lucida Console",
                textXOffset : 80,
                textYOffset : 35,
                onClick : this.changeMain
            }
        ]
    }

    constructor() {
        this.game = new GameClient();
        this.ctx = this.game.canvas.getContext('2d')
    }

    startMenu() {
        this.gameStarted = false;
        this.attachClickHandler();
        this.interval = setInterval(
            function(self) { return function() { self.render() } }(this), 
            CL_TICK_RATE
        );
    }

    startGame(self) {
        if (!self.gameStarted){
            clearInterval(self.interval)
            self.game.start();
            self.gameStarted = true;
            self.renderLoad(self)
        }
    }

    renderLoad() {
        this.ctx.fillStyle = "#dedede";
        this.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)

        this.ctx.fillStyle = "black";
        this.ctx.font = "50px Lucida Console";
        this.ctx.fillText(
            "LOADING...", 500, 400
        );    
    }

    render() {
        this.ctx.fillStyle = "#dedede";
        this.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
        
        for (const b of this.buttonRects[this.currentMenu]) {
            this.ctx.fillStyle = b.colour;
            this.ctx.fillRect(
                b.x, b.y,
                b.width, b.height
            );
            if (b.text) {
                this.ctx.fillStyle = b.textColour ? b.textColour : "black";
                this.ctx.font = b.font;
                const textWidth = this.ctx.measureText(b.text).width; 
                this.ctx.fillText(
                    b.text, b.x + b.width/2 - textWidth/2, b.y + b.textYOffset 
                );    
            }
        }
    }
    
    attachClickHandler() {
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
                    x: event.clientX - rect.left + 10,
                    y: event.clientY - rect.top + 10
                };
            }			

            window.addEventListener('click', function(event) {
                const mousePos = getCursorPosition(self.game.canvas, event);
                for (const rect of self.buttonRects[self.currentMenu]) {
                    if (isInside(mousePos, rect) && rect.onClick) {
                        rect.onClick(self);
                    }	
                }
            }, false);
        })(this);
    }

    changeHealthFreeze(self) {
        if (RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS == 15) {
            RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS = 30;
        }
        else if (RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS == 30) {
            RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS = 45;
        }
        else if (RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS == 45) {
            RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS = 15;
        }
        for (const menu of Object.values(self.buttonRects)) {
            for (let button of menu) {
                if (button.id == 'toggleLevel') {
                    if (RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS == 15) {
                        button.text = 'LOW'
                    }
                    else if (RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS == 30) {
                        button.text = 'MEDIUM'
                    }
                    else if (RENDER_OPTIONS.HEALTHBAR_FREEZE_TICKS == 45) {
                        button.text = 'HIGH'
                    }
                }
            }
        }
    }

    changeOptions(self) {
        self.currentMenu = "optionsMenu";
    }

    changeMain(self) {
        self.currentMenu = "mainMenu";
    }

    toggleLowspec(self) {
        for (const menu of Object.values(self.buttonRects)) {
            for (let button of menu) {
                if (button.id == 'toggledspecs') {
                    RENDER_OPTIONS.LOW_SPEC_MODE = !RENDER_OPTIONS.LOW_SPEC_MODE;
                    button.text = RENDER_OPTIONS.LOW_SPEC_MODE ? ' ' : 'X'
                }
            }
        }
    }

    toggleDebug(self) {
        for (const menu of Object.values(self.buttonRects)) {
            for (let button of menu) {
                if (button.id == 'toggleddebug') {
                    RENDER_OPTIONS.DEBUG_MODE = !RENDER_OPTIONS.DEBUG_MODE;
                    button.text = RENDER_OPTIONS.DEBUG_MODE ? 'X' : ' '
                }
            }
        }
    }
}   