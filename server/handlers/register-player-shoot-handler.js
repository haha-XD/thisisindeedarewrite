export function registerPlayerShootHandler(manager, socket) {
    const onTryShoot = function({clientTime}) {

    }

    socket.on('tryShoot', onTryShoot)
}