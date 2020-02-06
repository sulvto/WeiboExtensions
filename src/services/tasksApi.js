import { sendCallMessage } from './common'

export function list(callback) {
    sendCallMessage('task.manage.list', {}, callback);
};

export function stop(id) {
    sendCallMessage('task.manage.stop', { id });
};

export function remove(id) {
    sendCallMessage('task.manage.remove', { id });
};
