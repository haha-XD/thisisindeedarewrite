import { CL_TICK_RATE } from "./common/constants.js"
import GameClient from "./client-game.js";

export default class GameMenu {
    gameStarted = false;
    buttonRects = [
        {
            colour : "white",
            x : 635, 
            y : 300,
            width : 0,
            height : 0,
            text : "JUST DODGE",
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
            onClick : this.startGame
        }
    ];

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
        
        for (const b of this.buttonRects) {
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
                console.log(mousePos)
                for (const rect of self.buttonRects) {
                    if (isInside(mousePos, rect) && rect.onClick) {
                        rect.onClick(self);
                    }	
                }
            }, false);
        })(this);
    }
}   