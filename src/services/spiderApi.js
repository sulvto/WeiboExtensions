export function myfollow(uid, callback) {

    window.chrome.runtime.sendMessage({
        call: 'task.weibo.myfollow',
        params: {
            uid
        }
     }, callback);
};

export function follow(uid, callback) {

    window.chrome.runtime.sendMessage({
        call: 'task.weibo.follow',
        params: {
            uid
        }
     }, callback);
}

export function target(url, callback) {

    window.chrome.runtime.sendMessage({
        call: 'task.weibo.target',
        params: {
            url
        }
     }, callback);
}