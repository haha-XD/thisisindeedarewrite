export function registerManagerHandlers(manager, socket, io) {
    const tick = function() {
        socket.emit(manager.currentTick);
    }

    const onPing = function() {
        const p = socket.profile;
        const pId = p.playerEntity.id;
        
        socket.emit('pong', {
            pId: pId,
            currentTick: manager.currentTick
        });
    }

    const disconnect = function() {
        const p = socket.profile;
        const wId = p.currentWorld
        const id = p.playerEntity.id;
        io.emit('playerDisconnect', id)
        io.emit('message', { 
            playerName : '[SERVER]',
            message : `<em>${socket.profile.playerName} left the server.</em>`
        });
        delete manager.worlds[wId].players[id];
        manager.activeSockets = manager.activeSockets.filter((element) => element != socket);
        clearInterval(socket.updateInterval);
    }

    console.log('[SERVER] loaded manager handler', socket.profile.playerName)

    socket.on('input', tick);
    socket.on('ping', onPing);
    
    socket.on('disconnect', disconnect);
}