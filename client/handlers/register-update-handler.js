export function registerUpdateHandler(manager, socket) {
    const onUpdate = function(data) {
        manager.svMsgQueue.push(data)
    }

    socket.on('update', onUpdate)
 }