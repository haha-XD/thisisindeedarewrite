import express from 'express'
const app = express();
import http from 'http'
import { Server } from 'socket.io';

import { Manager } from './manager.js'
import Profile from './profile.js';
import * as h from './handlers/index.js'
import registerUpdater from './register-updater.js';
import registerTicker from './register-ticker.js';

app.use(express.static('client'));

const server = http.createServer(app);
const io = new Server(server);
const manager = new Manager(io);

manager.createWorld('nexus');

const onConnection = (socket) => {
    socket.profile = new Profile(manager, socket)

    h.registerInputHandlers(manager, socket);
    h.registerManagerHandlers(manager, socket);

    registerUpdater(manager, socket);
}
io.on('connection', onConnection);

registerTicker(manager);

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`[SERVER] now listening to port ${port}`);
});