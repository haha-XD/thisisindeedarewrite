import { DEBUG_MODE, ENTITY_CATEGORY } from "../common/constants.js";
import Point from "../common/utils/point.js";
import radians from "../common/utils/radians.js";
import Vector2 from "../common/utils/vector2.js";

export default class Renderer { 
    constructor(canvas, uiCanvas) {
        this.canvas = canvas;
        this.uiCanvas = uiCanvas;
        this.ctx = canvas.getContext('2d');
    }

    relativePosition(entity, player, rotation) {
        const centerPoint = new Point(
            this.canvas.width/2,
            this.canvas.height/2
        )
        let p = new Point(
            Math.trunc(entity.x - player.x),
            Math.trunc(entity.y - player.y)
        );
        p.rotate(rotation);
        p.add(centerPoint);
        return p;
    }

    draw(manager, rotation) {
        const player = manager.player;
        this.ctx.fillStyle = "#dedede";    
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for(const entity of Object.values(manager.entities.walls)) {
            const p = this.relativePosition(entity, player, rotation)
            this.blitWallProjection(entity.size, p.x, p.y - entity.size/2, rotation, 'black');
        }

        for (const entityType of Object.values(manager.entities)) {
            for (const entity of Object.values(entityType)) {
                if (entity.category == ENTITY_CATEGORY.walls) continue;

                const p = this.relativePosition(entity, player, rotation)

                if (!entity.rotate) this.blit(entity.size, p.x, p.y, '#750800');
                else this.blitRotated(entity.size, p.x, p.y, rotation, '#750800');
            }
        } 

        for(const entity of Object.values(manager.entities.walls)) {
            const p = this.relativePosition(entity, player, rotation)
            this.blitWallTop(entity.size, p.x, p.y - entity.size/2, rotation, "#3d0400");
        }

        if (DEBUG_MODE) {
            for (const entityType of Object.values(manager.entities)) {
                for (const entity of Object.values(entityType)) {
                    const p = this.relativePosition(entity, player, rotation)
                    if (entity.id) {
                        this.ctx.fillStyle = "black";
                        this.ctx.font = "20px Lucida Console";
                        this.ctx.fillText(
                            entity.id, 
                            p.x-entity.size/2, 
                            p.y+entity.size/2+15
                        );    
                    }            
                }
            }     
        }
        
        //hp bar
        let healthbarY = this.canvas.height * 8/9
        let healthbarX = this.canvas.width / 3.9
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
            healthbarX, 
            healthbarY, 
            healthbarX * 2, 
            25
        );
        this.ctx.fillStyle = "#750800";
        this.ctx.fillRect(
            healthbarX, 
            healthbarY, 
            healthbarX * 2 * (player.hp/player.maxhp), 
            25
        );
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Lucida Console";
        this.ctx.fillText(
            "HP", 
            healthbarX + 10, 
            healthbarY + 20
        );
        this.ctx.fillStyle = "white";
        this.canvas.font = "18px Lucida Console";
        this.ctx.fillText(
            `${player.hp}/${player.maxhp}`, 
            this.canvas.width/2.2, 
            healthbarY + 20
        );
    }

    blit(size, x, y, colour) {    
        this.ctx.fillStyle = colour ? colour : 'black';
        this.ctx.fillRect(
            x-size/2, 
            y-size/2, 
            size, size
        );
    }

    blitRotated(size, x, y, rotation, colour) {
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.rotate(radians(rotation))
        this.ctx.fillStyle = colour ? colour : 'grey';
        this.ctx.fillRect(
            -size/2, 
            -size/2, 
            size, size
        );
        this.ctx.restore()
    }

    blitWallTop(size, x, y, rotation, colour) {
        this.ctx.beginPath();
        this.ctx.fillStyle = colour ? colour : 'grey';
        //tl
        this.ctx.moveTo(x + ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) , y + ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)))
        //tr
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) , y + ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)))
        //br
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) , y - ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)))
        //bl
        this.ctx.lineTo(x + ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) , y - ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)))
        this.ctx.closePath()
        this.ctx.fill()
    }

    blitWallProjection(size, x, y, rotation, colour) {
        this.ctx.beginPath()
        this.ctx.fillStyle = colour ? colour : 'black';
        //tl
        this.ctx.moveTo(x + ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)))
        //tr
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)))
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.lineTo(x + ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.closePath()
        this.ctx.fill()

        //br
        this.ctx.moveTo(x - ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)))
        //bl
        this.ctx.lineTo(x + ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)))
        this.ctx.lineTo(x + ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.closePath()
        this.ctx.fill()

        //tr
        this.ctx.moveTo(x - ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)))
        //br
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)))
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.lineTo(x - ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  - ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.closePath()
        this.ctx.fill()

        //tl
        this.ctx.moveTo(x + ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)))
        //bl
        this.ctx.lineTo(x + ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)))
        this.ctx.lineTo(x + ( size / 2 ) * Math.cos(radians(rotation)) + ( size / 2 ) * Math.sin(radians(rotation)) ,  y - ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.lineTo(x + ( size / 2 ) * Math.cos(radians(rotation)) - ( size / 2 ) * Math.sin(radians(rotation)) ,  y + ( size / 2 ) * Math.cos(radians(rotation))  + ( size / 2 ) * Math.sin(radians(rotation)) + size)
        this.ctx.closePath()
        this.ctx.fill()    
    }
}