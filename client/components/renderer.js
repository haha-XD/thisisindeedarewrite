import { DEBUG_MODE, ENTITY_CATEGORY, HEALTHBAR_FREEZE_TICKS } from "../common/constants.js";
import Point from "../common/utils/point.js";
import radians from "../common/utils/radians.js";
import Vector2 from "../common/utils/vector2.js";

export default class Renderer { 
    undamagedTicks = 0;

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
            this.blitWallProjection(entity.size, p.x, p.y - entity.size/2, rotation, "#3d0400");
        }

        for (const entityType of Object.values(manager.entities)) {
            for (const entity of Object.values(entityType)) {
                if (entity.category == ENTITY_CATEGORY.walls) continue;

                const p = this.relativePosition(entity, player, rotation)
                
                if (manager.inGame) {
                    if (entity.invincible) {
                        this.ctx.fillStyle = "grey";
                        this.ctx.fillRect(p.x-30, p.y + entity.size/2 + 19, 60, 7)
                    } else if (entity.hp) {
                        const ratioHp = (entity.hp / entity.maxhp) > 0 ? (entity.hp / entity.maxhp) : 0;
                        this.ctx.fillStyle = "black";
                        this.ctx.fillRect(p.x-30, p.y + entity.size/2 + 19, 60, 7)
                        this.ctx.fillStyle = '#750800';
                        this.ctx.fillRect(p.x-30, p.y + entity.size/2 + 19, 60 * ratioHp, 7)
                    }
                }

                if (entity.damagedTicks > 0) {
                    this.blit(entity.size + 12, p.x, p.y, 'black')
                    entity.damagedTicks -= 1;
                }

                if (entity.category == ENTITY_CATEGORY.players) {
                    const playerColour = entity.dead ? 'grey' : '#750800'
                    this.blit(entity.size, p.x, p.y, playerColour);
                    
                    this.ctx.fillStyle = "black";
                    this.ctx.font = "15px Lucida Console";
                    const textWidth = this.ctx.measureText(entity.name).width; 
                    this.ctx.fillText(
                        entity.name, 
                        p.x - textWidth/2, 
                        p.y + 30
                    );
                } else if (entity.category == ENTITY_CATEGORY.projectiles) {
                    this.ctx.fillStyle = '#750800'
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, entity.size/2, 0, 2 * Math.PI);
                    this.ctx.fill();
                } 
                else if (!entity.rotate) this.blit(entity.size, p.x, p.y, '#750800');
                else this.blitRotated(entity.size, p.x, p.y, rotation, '#750800');
            }
        } 

        for(const entity of Object.values(manager.entities.walls)) {
            const p = this.relativePosition(entity, player, rotation)
            this.blitWallTop(entity.size, p.x, p.y - entity.size/2, rotation, "#750800");
        }

        if (DEBUG_MODE) {
            for (const entityType of Object.values(manager.entities)) {
                for (const entity of Object.values(entityType)) {
                    const p = this.relativePosition(entity, player, rotation)
                    if (entity.id) {
                        this.ctx.fillStyle = "black";
                        this.ctx.font = "20px Lucida Console";
                        const textWidth = this.ctx.measureText(entity.name).width; 
                        this.ctx.fillText(
                            entity.id, 
                            p.x+entity.size/2 -textWidth/2,
                            p.y+entity.size/2+35
                        );    
                    }            
                }
            }     
        }
        
        //hp bar
        this.drawUI(player, manager);

        for (const b of manager.buttonRects) {
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

    drawUI(player, manager) {
        if (!player.dead && manager.inGame) {
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
            const ratioHp = (player.hp/player.maxhp) >= 0 ? (player.hp/player.maxhp) : 0
            this.ctx.fillRect(
                healthbarX, 
                healthbarY, 
                healthbarX * 2 * ratioHp, 
                25
            );
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(
                healthbarX + (healthbarX * 2 * ratioHp), 
                healthbarY, 
                healthbarX * 2 * (manager.renderHp - player.hp) / player.maxhp, 
                25
            );
            if (manager.tempHp == 0) manager.tempHp = player.hp;
            if (manager.renderHp == 0) manager.renderHp = player.hp;
            if (manager.tempHp == player.hp) { //no change
                manager.undamagedTicks += 1;                
            } else if (manager.tempHp != player) { //change
                manager.undamagedTicks = 0;
            }
            if (manager.undamagedTicks >= HEALTHBAR_FREEZE_TICKS) {
                manager.renderHp = player.hp
            }
            manager.tempHp = player.hp;
            this.ctx.fillStyle = "white";
            this.ctx.font = "20px Lucida Console";
            this.ctx.fillText(
                "HP", 
                healthbarX + 10, 
                healthbarY + 20
            );
            this.ctx.fillStyle = "white";
            this.canvas.font = "18px Lucida Console";
            const hpString = `${player.hp}/${player.maxhp}`;
            const textWidth = this.ctx.measureText(hpString).width; 
            this.ctx.fillText(
                hpString, 
                this.canvas.width/2 - textWidth/2, 
                healthbarY + 20
            );
            this.ctx.fillStyle = "black";
            this.canvas.font = "18px Lucida Console";
            const dmgString = `${manager.damageDone} damage done (${Math.floor(manager.damageDone/manager.totalBossHp*100)}%).`;
            const dmgTextWidth = this.ctx.measureText(dmgString).width; 
            this.ctx.fillText(
                dmgString, 
                this.canvas.width/2 - dmgTextWidth/2, 
                healthbarY + 45
            );
        }
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