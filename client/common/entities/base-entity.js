let id = 0;

export class Entity {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        
        this.id = id;
        id++;
    }

    detectEnemyCollision(entity) {
        if (!(this.right < entity.left ||
              this.left > entity.right ||
              this.bottom < entity.top ||
              this.top > entity.bottom)) {
            return true;
        } else {
            return false;
        }
    }

    get state() { return { ...this }; }

    get top() { return this.y - this.size; }
    get bottom() { return this.y + this.size; }
    get left() { return this.x - this.size; }
    get right() { return this.x + this.size; }
}

