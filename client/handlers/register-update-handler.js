export function registerUpdateHandler(networking, socket) {
    const onUpdate = function(data) {
        networking.svMsgQueue.push(data)
    }

    socket.on('update', onUpdate)
 }