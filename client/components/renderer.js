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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.UIctx.clearRect(0, 0, this.UIcanvas.width, this.UIcanvas.height);

        for (const entityType of Object.values(manager.entities)) {
            for (const entity of Object.values(entityType)) {
                let p = new Point(
                    Math.trunc(entity.x - manager.player.x),
                    Math.trunc(entity.y - manager.player.y)
                );
                p.rotate(rotation);
                p.add(centerPoint);

                if (!entity.rotate) this.blit(entity.size, p.x, p.y);
                else this.blitRotated(entity.size, p.x, p.y, rotation)
            }
        } 
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