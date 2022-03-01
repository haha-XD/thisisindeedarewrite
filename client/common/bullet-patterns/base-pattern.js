let id = 1;

export class BulletPattern {
    constructor(x, y, shotCount, projDesc, identifier) {
        this.x = x;
        this.y = y;
        this.shotCount = shotCount;
        this.projDesc = projDesc;

        if (identifier) {
            this.id = identifier;    
        } else {
            this.id = id;
            id++;
        }
    }

    createProjs() {
        console.error('bullet pattern missing createprojs function')
    }

    get state() { return {...this} }
}

