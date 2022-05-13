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
        socket.profile = new Profile(manager, socket)

        h.registerManagerHandlers(manager, socket);
        h.registerInputHandlers(manager, socket);
        h.registerBulletAckHandler(manager, socket);
    
        registerUpdater(manager, socket);
    }
    socket.on('startGame', onStartGame);
}
io.on('connection', onConnection);

registerTicker(manager);

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`[SERVER] now listening to port ${port}`);
});