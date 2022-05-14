export default class Profile {
    currentWorld = 0;
    inputAckNum = 0;
    
    bulletPatterns = {}
    bullets = [];

    shotBullets = [];
    
    constructor(manager, socket, playerName) {
        this.playerEntity = manager.worlds[this.currentWorld].spawnPlayer(socket); 
        this.playerEntity.name = playerName;
    }

    get playerName() { return this.playerEntity.name; }
}