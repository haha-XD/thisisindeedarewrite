import * as bulletPatterns from '../common/bullet-patterns/index.js';

export function registerBulletPatternHandler(manager, socket) {
    const onBulletPattern = function(data) {
        const bulletPattern = new bulletPatterns[data.objType](data);
        bulletPattern.createProjs(manager.projectiles); 
        socket.emit('ackBulletPattern', {
            id: bulletPattern.id,
            clientTime: Date.now()
        })
    }
    socket.on('bulletPattern', onBulletPattern)
}