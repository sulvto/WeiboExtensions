function sendCallMessage(name, params, callback) {
    window.chrome.runtime.sendMessage({
        call: name,
        params
     }, callback);
}

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

export function myfollow(uid, callback) {
    getCache(`task.weibo.myfollow.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.myfollow', {uid}, function(data) {
            load(data);
        });
    })
};

export function follow(uid, callback) {
    getCache(`task.weibo.follow.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.follow', {uid}, function(data) {
            load(data);
        });
    })
}

export function profile(uid, callback) {
    getCache(`task.weibo.profile.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.profile', {uid}, function(data) {
            load(data);
        });
    })
}

export function detail(uid, callback) {
    getCache(`task.weibo.detail.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.detail', {uid}, function(data) {
            load(data);
        });
    })
}

export function detailRepost(uid, callback) {
    getCache(`task.weibo.detail.repost.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.detail.repost', {uid}, function(data) {
            load(data);
        });
    })
}

export function detailComment(uid, callback) {
    getCache(`task.weibo.detail.comment.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.detail.comment', {uid}, function(data) {
            load(data);
        });
    })
}

export function detailLike(uid, callback) {
    getCache(`task.weibo.detail.like.${uid}`, callback, function (load) {
        sendCallMessage('task.weibo.detail.like', {uid}, function(data) {
            load(data);
        });
    })
}