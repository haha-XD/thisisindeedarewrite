export function registerPlayerShootHandler(manager, socket) {
    const onTryShoot = function({clientTime}) {

    }

    console.log('[SERVER] loaded shoot handler', socket.profile.playerName)

    socket.on('tryShoot', onTryShoot)
}