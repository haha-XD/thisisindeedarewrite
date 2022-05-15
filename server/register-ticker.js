import { SV_TICK_RATE } from "../client/common/constants.js"
import { autoServerMessages } from "./autoServerMessages.js";

export default function registerTicker(manager) {
    const tick = function() {
        manager.tick();
        autoServerMessages(manager);

        if ((manager.readyPlayerCount / manager.playerCount) >= 0.75 && manager.playerCount > 1 && !manager.gameStarting && !manager.inGame) {
            manager.gameStarting = true;
            manager.io.emit('message', {
                playerName : '[SERVER]',
                message : '<em>Game starting in 5 seconds...</em>'
            });
    
            setTimeout(function() {
                manager.startGame();
            }, 5000)
        }
    }
    
    setInterval(tick, SV_TICK_RATE)
}   