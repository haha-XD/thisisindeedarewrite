import { SV_TICK_RATE } from "../client/common/constants.js"

export default function registerTicker(manager) {
    const tick = function() {
        manager.tick();
        console.log(manager.currentTick)
    }
    setInterval(tick, SV_TICK_RATE)
}