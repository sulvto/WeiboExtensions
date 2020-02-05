function sendCallMessage(name, params, callback) {
    window.chrome.runtime.sendMessage({
        call: name,
        params
     }, callback);
}

export function myfollow(uid, callback) {
    getCache(`task.weibo.myfollow.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.myfollow', {uid}, function(data) {
            load(data);
        });
    })
};

function getCache(key, callback, loader) {
    sendCallMessage('cache.get', {key}, function(value) {
        if (value) {
            callback(value);
        } else if (loader) {
            loader(function(data) {
                callback(data);
                putCache(key, data);
            })
        } else {
            callback(null);
        }
    })
}

function putCache(key, value) {
    sendCallMessage('cache.put', {key, value});
}

export function follow(uid, callback) {
    getCache(`task.weibo.follow.${uid}`, function(value) {
        console.log('getCache', value);
        if (value) {
            callback(value);
        } else {
            sendCallMessage('task.weibo.follow', {uid}, function(data) {
                putCache(`task.weibo.follow.${uid}`, data);
                callback(data);
            });
        }
    })
}

export function target(url, callback) {
    sendCallMessage('task.weibo.target', {url}, callback);
}