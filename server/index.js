import express from 'express'
const app = express();
import http from 'http'
import { Server } from 'socket.io';

import { Manager } from './components/manager.js'
import Profile from './components/profile.js';
import * as h from './handlers/index.js'
import registerUpdater from './register-updater.js';
import registerTicker from './register-ticker.js';

app.use(express.static('client'));

const server = http.createServer(app);
const io = new Server(server);
const manager = new Manager(io);

manager.createWorld('nexus', 0);

const onConnection = (socket) => {
    const onStartGame = function() {
        const playerName = "Guest" + Math.floor(Math.random() * 1000); 
        socket.profile = new Profile(playerName);
        manager.activeSockets.push(socket);
        socket.profile.playerEntity = manager.worlds[socket.profile.currentWorld].spawnPlayer(socket);

        io.emit('message', {
            playerName : '[SERVER]',
            message : `<em>${playerName} joined the server.</em>`
        });
        socket.emit('message', {
            playerName : '[SERVER]',
            message : `
                <br><em><b>Welcome to Dodge Game.</b></em>
                <br>
                <em>Dodge bullets and shoot enemies!</em>
                <br>
                <em>List of commands:</em><br>
                <em>/help - Displays this message</em><br>
                <em>/ready - mark yourself as ready to join the next game</em><br>
                <em>/name &lt;name&gt; - change your name</em><br>
                <em>/ticket &lt;message&gt; - send a ticket to the server admin</em>
            `
        })
        
        h.registerMessageHandler(manager, socket, io);
        h.registerManagerHandlers(manager, socket, io);
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