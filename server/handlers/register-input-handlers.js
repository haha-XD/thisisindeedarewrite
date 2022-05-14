export function registerInputHandlers(manager, socket) {
    const input = function({num, inputs, rot}) {
        const p = socket.profile
        const wId = p.currentWorld;
        const wallEntities = Object.values(manager.worlds[wId].walls)

        p.playerEntity.applyInput(rot, inputs, wallEntities) //applyInput takes array of walls
        p.inputAckNum = num;
    }

    console.log('[SERVER] loaded input handler', socket.profile.playerName)

    socket.on('input', input)
}