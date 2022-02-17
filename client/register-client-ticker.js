import { CL_TICK_RATE } from "./common/constants.js"

export default function registerClTicker(manager) {
    const tick = function() {
        manager.tick();
    }
    setInterval(tick, CL_TICK_RATE)
}