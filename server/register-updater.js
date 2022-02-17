import { SV_UPDATE_RATE } from "../client/common/constants.js"

export default function registerUpdater(manager, socket) {
    const update = function() {
        const p = socket.profile;
        const stateNear = manager.stateNear(socket); 
        const inputAckNum = p.inputAckNum
        const data = {
            inputAckNum: inputAckNum,
            state: stateNear
        }        
        socket.emit('update', data)
    }
    setInterval(update, SV_UPDATE_RATE)
}