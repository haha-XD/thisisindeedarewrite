export default class Profile {
    currentWorld = 0;
    inputAckNum = 0;
    
    constructor(manager, socket) {
        this.playerEntity = manager.worlds[this.currentWorld].spawnPlayer(socket);   
    }
}