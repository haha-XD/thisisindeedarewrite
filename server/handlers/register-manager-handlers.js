export function registerManagerHandlers(manager, socket) {
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
        manager.worlds[wId].deleteEntity(id);
    }

    socket.on('input', tick);
    socket.on('ping', onPing);
    
    socket.on('disconnect', disconnect);
}