export function registerMessageHandler(manager, socket, io) {
    const validMessage = function(message) {
        return message && message.length < 40
    }

    const onMessage = function({message}) {
        if (!validMessage(message)) {
            socket.emit('message', {
                playerName : '[SERVER]',
                message : 'Invalid message.'
            });
            return;
        };
        io.emit('message', { 
            playerName : socket.profile.playerName,
            message : message 
        });
    }

    console.log('[SERVER] loaded message handler', socket.profile.playerName)

    socket.on('message', onMessage);
}