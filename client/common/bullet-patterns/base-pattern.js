export class BulletPattern {
    constructor(x, y, shotCount, projDesc) {
        this.x = x;
        this.y = y;
        this.shotCount = shotCount;
        this.projDesc = projDesc;
    }

    createProjs() {
        console.error('bullet pattern missing createprojs function')
    }

    get state() { return {...this} }
}

