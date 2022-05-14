import { SV_TICK_RATE } from '../../client/common/constants.js';
import World from './world.js';

export class Manager {
    currentTick = 0;
    startTime = Date.now();
    lastTs = Date.now();
    worlds = {};
    activeSockets = [];
    inGame = false;
    gameStarting = false;
    gameStopping = false;

    constructor(io) {
        this.io = io
    }

    startGame() {
        this.gameStarting = false;
        this.inGame = true;
        this.io.emit('message', {
            playerName : '[SERVER]',
            message : '<em>Game started !</em>'
        });

        const arena = this.createWorld('arena', 1)
        for (let socket of this.activeSockets) {
            if (socket.profile.ready) {
                this.movePlayer(socket, arena)
                socket.profile.inGame = true;
                socket.profile.ready = false;
            }
        }
    }

    stopGame(world) {
        this.gameStopping = false;
        this.inGame = false;
        for (let socket of this.activeSockets) {
            if (socket.profile.inGame) {
                this.movePlayer(socket, 0)
                socket.profile.inGame = false;
            }
        }
        delete this.worlds[world];
    }

    movePlayer(socket, world) {
        let profile = socket.profile;
        delete this.worlds[profile.currentWorld].players[profile.playerEntity.id];
        profile.playerEntity = this.worlds[world].spawnPlayer(socket); 
        socket.profile.currentWorld = world;
        socket.profile.bullets = [];
        socket.emit('worldChange', profile.playerEntity.id);
    }

    tick() {
        const nowTs = Date.now();
        this.dt = (nowTs - this.lastTs)/1000;
        this.lastTs = nowTs;
        
        this.currentTick = Math.floor((Date.now()-this.startTime)/SV_TICK_RATE)
        for (const w in this.worlds) {
            for (const e of Object.values(this.worlds[w].enemies)) {
                e.tick(this, w);
            }
            this.worlds[w].updateChunks()
        }

        if (this.inGame && !this.gameStopping) {
            if (this.alivePlayersInGame.length == 0) {
                this.io.emit('message', {
                    playerName : '[SERVER]',
                    message : '<b><em>Game ended with no survivors!</em></b>'
                });
                this.gameStopping = true;
                setTimeout(function() {
                    this.stopGame(1);
                }.bind(this), 5000)
                this.stopGame(1);
            } else if (this.alivePlayersInGame.length == 1) {
                this.io.emit('message', {
                    playerName : '[SERVER]',
                    message : `<b>"${this.alivePlayersInGame[0].name}" was the sole survivor out of ${this.playersInGame.length} players!</b>`
                });
                this.gameStopping = true;
                setTimeout(function() {
                    this.stopGame(1);
                }.bind(this), 5000)
            }
        }
    }

    createWorld(worldName, wId) {
        const world = new World(worldName)
        world.id = wId;
        this.worlds[wId] = world;
        this.worlds[wId].updateChunks()
        return world.id;
    }

    stateNear(socket) {
        const p = socket.profile;
        const chunks = this.worlds[p.currentWorld].chunks;
        const nearChunks = World.getNearChunks(p.playerEntity.chunkLoc, chunks);
        return nearChunks;
    }

    get readyPlayerCount() { return this.activeSockets.filter((socket) => socket.profile.ready).length; }
    get playerCount() { return this.activeSockets.length; }
    get playersInGame() { return Object.values(this.worlds[1].players); }
    get alivePlayersInGame() { return this.playersInGame.filter((entity) => !entity.dead); }
}