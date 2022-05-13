export default class GameMenu {
    gameStarting = false;
    buttonRects = [
        {
            colour : "white",
            x : 280, 
            y : 300,
            width : 0,
            height : 0,
            text : "JUST DODGE",
            textColour : "#3d0400",
            font : "100px Lucida Console",
            textXOffset : 50,
            textYOffset : 35
        },
        {
            colour : "black",
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
            colour : "black",
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

    constructor(game) {
        this.game = game;
        this.ctx = this.game.canvas.getContext('2d')
        this.attachClickHandler()
        this.render();
    }

    startGame(self) {
        if (!self.gameStarted){
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
                this.ctx.fillText(
                    b.text, b.x + b.textXOffset, b.y + b.textYOffset
                );    
            }
        }
    }
    
    attachClickHandler() {
        (function (self) {
            function isInside(pos, rect){
                console.log(pos, rect)
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
                let mousePos = getCursorPosition(self.game.canvas, event);
                for (const rect of self.buttonRects) {
                    if (isInside(mousePos, rect) && rect.onClick) {
                        rect.onClick(self);
                    }	
                }
            }, false);
        })(this);
    }
}   