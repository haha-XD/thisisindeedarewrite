export function autoServerMessages(manager) {
    if (!manager.inGame && manager.playerCount > 1) {
        if (manager.currentTick % 400 == 0) {
            manager.io.emit('message', {
                playerName : '[SERVER]',
                message : `<em>${manager.readyPlayerCount}/${manager.playerCount} players ready.\nUse "/ready" to join the next game.</em>`
            });
        }
    } else if (!manager.inGame && manager.playerCount == 1) {
        if (manager.currentTick % 400 == 0) {
            manager.io.emit('message', {
                playerName : '[SERVER]',
                message : '<em>Waiting on 2 or more players...</em>'
            });
        }
    }
}