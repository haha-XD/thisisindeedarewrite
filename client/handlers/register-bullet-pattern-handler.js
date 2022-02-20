export function registerBulletPatternHandler(manager, socket) {
    const onBulletPattern = function({}) {

    }
    socket.on('bulletPattern', onBulletPattern)
 }