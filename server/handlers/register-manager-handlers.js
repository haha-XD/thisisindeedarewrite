export function registerManagerHandlers(manager, socket) {
    const tick = function() {
        socket.emit(manager.tick);
    }

    const pong = function() {
        socket.emit('pong')
    }

    const disconnect = function() {
        const p = socket.profile;
        const wId = p.currentWorld
        const id = p.playerEntity.id;
        manager.worlds[wId].deleteEntity(id);
    }

    socket.on('input', tick)
    socket.on('ping', pong)
    
    socket.on('disconnect', disconnect)
}