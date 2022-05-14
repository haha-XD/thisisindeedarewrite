export default class Profile {
    currentWorld = 0;
    inputAckNum = 0;
    
    bulletPatterns = {}
    bullets = [];

    shotBullets = [];

    inGame = false;
    ready = false;
    
    lastTimePacket = 0

    playerEntity;
    
    constructor(playerName) {
        this.playerName = playerName;
    }
}