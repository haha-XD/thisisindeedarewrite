export default function waitUntil(condition, callback, delay=1000) {
    const waitUntilConnected = setInterval(() => {
        if (!condition()) return;
        callback()
        clearInterval(waitUntilConnected)
    }, delay)
}