import express from 'express'
const app = express();
import http from 'http'
import { Server } from 'socket.io';

import { Manager } from './server/manager.js'

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('client'));

let manager = new Manager()
manager.createWorld('nexus')

const onConnection = (socket) => {
    console.log('hi')
    manager.chunks;
}
io.on('connection', onConnection)

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`[SERVER] now listening to port ${port}`);
});