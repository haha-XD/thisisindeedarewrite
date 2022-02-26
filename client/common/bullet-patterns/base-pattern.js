export class BulletPattern {
    constructor(x, y, projDesc) {
        this.x = x;
        this.y = y;
        this.projDesc = projDesc;
    }

    createProjs() {
        console.error('bullet pattern missing createprojs function')
    }

    get state() { return {...this} }
}

