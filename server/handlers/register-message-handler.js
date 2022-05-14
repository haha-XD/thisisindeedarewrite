import escapeMarkup from "../../client/common/utils/escape-markup.js";

export function registerMessageHandler(manager, socket, io) {
    const validMessage = function(message) {
        return message && message.length < 40
    }

    const onMessage = function({message}) {
        message = escapeMarkup(message);

        if (!validMessage(message)) {
            socket.emit('message', {
                playerName : '[SERVER]',
                message : 'Invalid message.'
            });
            return;
        };
        if (message.startsWith('/')) { //command
            const command = message.slice(1);
            
            if (command.startsWith('ready')) {
                if (!manager.inGame) {
                    socket.profile.ready = true;
                    io.emit('message', { 
                        playerName : '[SERVER]',
                        message : `<em>${socket.profile.playerName} is now ready. (${manager.readyPlayerCount}/${manager.playerCount})</em>`
                    });
                } else {
                    socket.emit('message', { 
                        playerName : '[SERVER]',
                        message : '<em>A game has already started. Please wait until after the game has finished before using "/ready".</em>'
                    });
                }
            }
            if (command.startsWith('world')) {
                socket.emit('message', { 
                    playerName : '[SERVER]',
                    message : `<em>You are in world ${socket.profile.currentWorld}.</em>`
                });
            }
            if (command.startsWith('stop')) {
                if (socket.profile.currentWorld == 0) {
                    socket.emit('message', { 
                        playerName : '[SERVER]',
                        message : `<em>You can not delete world ${socket.profile.currentWorld}.</em>`
                    });
                    return;
                }
                manager.io.emit('message', { 
                    playerName : '[SERVER]',
                    message : `<em>Closing world ${socket.profile.currentWorld}.</em>`
                });
                manager.stopGame(socket.profile.currentWorld);
            }
            if (command.startsWith('name')) {
                const name = escapeMarkup(command.split(' ')[1])
                if (name.length > 10) {
                    socket.emit('message', { 
                        playerName : '[SERVER]',
                        message : `<em>Invalid name. Names must be less than 11 characters</em>`
                    });    
                } else {
                    manager.io.emit('message', { 
                        playerName : '[SERVER]',
                        message : `<em>"${socket.profile.playerName}" has changed their name to "${name}".</em>`
                    });    
                    socket.profile.playerName = name;
                    socket.profile.playerEntity.name = name;
                }
            }
        }
        else { //chat message
            io.emit('message', { 
                playerName : socket.profile.playerName,
                message : message 
            });
        }
    }

    console.log('[SERVER] loaded message handler', socket.profile.playerName)

    socket.on('message', onMessage);
}