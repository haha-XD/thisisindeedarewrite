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
        const safeName = escapeMarkup(playerName);
        const safeMessage = escapeMarkup(message);
        console.log(`<b>\<${safeName}\></b>: ${safeMessage}<br>`);
        manager.chatMsgs.push(`<b>${safeName}</b>: ${safeMessage}<br>`);
        updateTextbox();
    }

    socket.on('message', onMessage);
}