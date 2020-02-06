export function sendCallMessage(name, params, callback) {
    window.chrome.runtime.sendMessage({
        call: name,
        params: params ? params : {}
     }, callback ? callback : () => {});
}
