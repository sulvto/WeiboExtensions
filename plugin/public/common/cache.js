(function(window) {
    function CacheEntity(key, value) {
        this.key = key;
        this.value = value;
        this.max = 1000;
    }


    CacheEntity.prototype.eq = function(entity) {
        return this.key === entity.key;
    }

    function CacheQueueEntity(entity, timeout) {
        this.entity = entity;
        this.timeout = timeout;
        this.time = new Date().getTime();
        this.left = null;
        this.right = null;
    }

    CacheQueueEntity.prototype.isTimeout = function() {
        if (this.timeout && this.timeout > 0) {
            return (new Date().getTime()- this.time) > this.timeout;
        } else {
            return false;
        }
    }

    CacheQueueEntity.prototype.updateTime = function() {
        this.time = new Date().getTime();
    }

    CacheQueueEntity.prototype.eq = function(obj) {
        return this.key === obj.key;
    }

    CacheQueueEntity.prototype.print = function() {
        return this.entity.print();
    }

    function CacheQueue(max) {
        this.first = null;
        this.last = null;
        this.max = (max && max > 0) ? max : null;
        this.length = 0;
        this.removeListeners = [];
    }

    CacheQueue.prototype.put = function(obj, timeout) {
        if (!(obj instanceof CacheEntity)) {
            console.error('CacheQueue.put must be CacheEntity');
            return;
        }
        this.remove(obj);
        let queueEntity = new CacheQueueEntity(obj, timeout);
        if (this.first === null) {
            this.first = queueEntity;
            this.last = queueEntity;
        } else {
            this.first.left = queueEntity;
            queueEntity.right = this.first;
            this.first = queueEntity;
        }
        this.length++;
    }

    CacheQueue.prototype.removeOld = function() {
        while (this.max && this.max > this.length) {
            this.olds = [];
            this.forEach(function (queueEntity) {
                if (queueEntity.isTimeout()) {
                    this.olds[this.olds.length] = queueEntity;
                }
            });
            let that = this;
            this.olds.forEach(function(item) {
                that.remove(item);
            });
            if (this.olds.length < 1) {
                that.remove(that.last);
            }
        }
    }

    CacheQueue.prototype.addRemoveListener = function(listener) {
        this.removeListeners[this.removeListeners.length++] = listener;
    }


    CacheQueue.prototype.remove = function(obj) {
        if (!(obj instanceof CacheEntity)) {
            console.error('CacheQueue.remove must be CacheEntity');
            return;
        }
        let queueEntity = this.find(obj);
        
        if (queueEntity == null) return false;

        if (queueEntity.left) {
            queueEntity.left.right = queueEntity.right;
        } else {
            this.first = queueEntity.right;
        }

        if (queueEntity.right) {
            queueEntity.right.left = queueEntity.left;
        } else {
            this.last = queueEntity.left;
        }
        this.removeListeners.forEach(function(listener) {
            listener(queueEntity.entity);
        });
        this.length--;
        return true;
    }

    CacheQueue.prototype.get = function(obj) {
        let queueEntity = this.find(obj);
        if (queueEntity != null) {
            if (queueEntity.isTimeout()) {
                this.remove(queueEntity.entity);
                return null;
            } else {
                return queueEntity.entity;
            }
        } else {
            return null;
        }
    }

    CacheQueue.prototype.find = function(obj) {
        if (!(obj instanceof CacheEntity)) {
            console.error('CacheQueue.find must be CacheEntity');
            return;
        }
        if (this.first != null) {
            let queueEntity = this.first;
            while (queueEntity != null && !queueEntity.eq(obj)) {
                queueEntity = queueEntity.right;
            }
            return queueEntity;
        } else {
            return null;
        }
    }

    CacheQueue.prototype.forEach = function(fun) {
        if (!fun) return;
        if (this.first != null) {
            let queueEntity = this.first;
            while (queueEntity != null) {
                fun(queueEntity);
                queueEntity = queueEntity.right;
            }
        }
    }

    CacheQueue.prototype.print = function() {
        console.log('CacheQueue.length', this.length);
        this.forEach(function(queueEntity) {
            queueEntity.print();
        })
    }

    function Cache() {
        this.queue = new CacheQueue(this.max);
        this.map = [];
        let that = this;
        this.queue.addRemoveListener(function(entity) {
            that.map[entity.key] = null;
        })
    }

    Cache.prototype.put = function(key, value, timeout) {
        console.info('Cache.put', key, value);
        let entity = new CacheEntity(key, value);
        this.queue.put(entity, timeout);
        this.map[key] = entity;
    }

    Cache.prototype.get = function(key) {
        let value = null;
        let entity = this.map[key];
        if (entity != null) {
            this.queue.put(entity);
            value = entity.value;
        }
        console.info('Cache.get', key, value);
        return value;
    }

    window.CACHE = new Cache();
})(window);