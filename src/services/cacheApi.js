import { sendCallMessage } from './common'

export function getCache(key, callback, loader) {
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

export function putCache(key, value) {
    sendCallMessage('cache.put', {key, value});
}
