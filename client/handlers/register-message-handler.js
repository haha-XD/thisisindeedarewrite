import escapeMarkup from '../common/utils/escape-markup.js'

export function registerMessageHandler(manager, socket, msgBox) {
    const updateTextbox = function() {
        if (manager.chatMsgs.length > 30) manager.chatMsgs = manager.chatMsgs.slice(1)
        msgBox.innerHTML = ""
        for (const msg of manager.chatMsgs) {
            msgBox.innerHTML += msg;
        }
    }

    const onMessage = function({playerName, message}) {
        manager.chatMsgs.push(`<b>&lt;${playerName}&gt;</b>: ${message}<br>`);
        updateTextbox();
    }

    socket.on('message', onMessage);
}