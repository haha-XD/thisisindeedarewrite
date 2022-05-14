import express from 'express'
const app = express();
import http from 'http'
import { Server } from 'socket.io';

import { Manager } from './components/manager.js'
import Profile from './components/profile.js';
import * as h from './handlers/index.js'
import Database from './components/database.js';
import registerUpdater from './register-updater.js';
import registerTicker from './register-ticker.js';

app.use(express.static('client'));

const server = http.createServer(app);
const io = new Server(server);
const manager = new Manager(io);

manager.createWorld('nexus');
//const db = new Database()
//db.createAccountTable();

const onConnection = (socket) => {
    const onStartGame = function() {
        const playerName = "Guest" + Math.floor(Math.random() * 1000); 
        socket.profile = new Profile(manager, socket, playerName);

        io.emit('message', {
            playerName : '[SERVER]',
            message : `${playerName} joined the lobby.`
        });

        h.registerMessageHandler(manager, socket, io);
        h.registerManagerHandlers(manager, socket);
        h.registerInputHandlers(manager, socket);
        h.registerBulletAckHandler(manager, socket);
    
        socket.updateInterval = registerUpdater(manager, socket);
        socket.off('startGame', onStartGame);
    }
    socket.on('startGame', onStartGame);
}
io.on('connection', onConnection);

registerTicker(manager);

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`[SERVER] now listening to port ${port}`);
});