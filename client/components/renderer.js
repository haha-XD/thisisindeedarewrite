import { DEBUG_MODE } from "../common/constants.js";
import Point from "../common/utils/point.js";
import radians from "../common/utils/radians.js";

export default class Renderer { 
    constructor(canvas, UIcanvas) {
        this.canvas = canvas;
        this.UIcanvas = UIcanvas;
        this.ctx = canvas.getContext('2d');
        this.UIctx = UIcanvas.getContext('2d');
    }

    draw(manager, rotation) {
        const centerPoint = new Point(
            this.canvas.width/2,
            this.canvas.height/2
        )
        const player = manager.player;    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.UIctx.clearRect(0, 0, this.UIcanvas.width, this.UIcanvas.height);

        for (const entityType of Object.values(manager.entities)) {
            for (const entity of Object.values(entityType)) {
                let p = new Point(
                    Math.trunc(entity.x - player.x),
                    Math.trunc(entity.y - player.y)
                );
                p.rotate(rotation);
                p.add(centerPoint);

                if (!entity.rotate) this.blit(entity.size, p.x, p.y);
                else this.blitRotated(entity.size, p.x, p.y, rotation)
            }
        } 

        if (DEBUG_MODE) {
            for (const entityType of Object.values(manager.entities)) {
                for (const entity of Object.values(entityType)) {
                    let p = new Point(
                        Math.trunc(entity.x - player.x),
                        Math.trunc(entity.y - player.y)
                    );
                    p.rotate(rotation);
                    p.add(centerPoint);
    
                    if (entity.id) {
                        this.ctx.fillStyle = "black";
                        this.ctx.font = "20px Verdana";
                        this.ctx.fillText(
                            entity.id, 
                            p.x-entity.size/2, 
                            p.y+entity.size/2+15
                        );    
                    }            
                }
            }     
        }

        this.UIctx.beginPath();
        this.UIctx.fillStyle = "grey";
        this.UIctx.fillRect(this.UIcanvas.width/30, 
                            this.UIcanvas.height/2.5, 
                            this.UIcanvas.width/30 * 28, 
                            25);
        this.UIctx.beginPath();
        this.UIctx.fillStyle = "red";
        this.UIctx.fillRect(this.UIcanvas.width/30, 
                            this.UIcanvas.height/2.5, 
                            this.UIcanvas.width/30 * 28 * (player.hp/player.maxhp), 
                            25);
        this.UIctx.fillStyle = "white";
        this.UIctx.font = "20px Verdana";
        this.UIctx.fillText("HP", 
                            this.UIcanvas.width/15, 
                            this.UIcanvas.height/2.35);
        this.UIctx.font = "bold 18px helvetica";
        this.UIctx.fillText(`${player.hp}/${player.maxhp}`, 
                            this.UIcanvas.width/2.5, 
                            this.UIcanvas.height/2.36);
    }

    blit(size, x, y) {    
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x-size/2, 
                          y-size/2, 
                          size, size);
    }

    blitRotated(size, x, y, rotation) {
        this.ctx.save()
            this.ctx.translate(x, y)
            this.ctx.rotate(radians(rotation))
            this.ctx.fillStyle = 'grey';
            this.ctx.fillRect(-size/2, 
                              -size/2, 
                              size, size);
        this.ctx.restore()
    }
}