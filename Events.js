
// 观察者模式   事件发布 --- 订阅

class Events {
    constructor() {
        this.map = new Map()
    }
    // 订阅
    on(key, cb, ...args) {
        const getkey = this.map.get(key) || new Map();
        getkey.set(cb, args);
        this.map.set(key, getkey);
    }
    // 取消订阅
    off(key, cb) {
        const getkey = this.map.get(key) || new Map();
        getkey.delete(cb)
    }
    // 发布
    emit(key, ...args) {
        const cbMap = this.map.get(key);
        for (const cb of cbMap.keys()) {
            const oldArgs = cbMap.get(cb);
            if (oldArgs) {
                cb(...oldArgs, ...args);
            } else {
                cb(...args);
                this.off(key, cb);
            }
        }
    }
    // 监听 只执行一次
    listeners(key, cb) {
        const getkey = this.map.get(key) || new Map();
        getkey.set(cb, null);
        this.map.set(key, getkey);
    }

};


function Eventloop() {
    this.eventobj = {};

    Eventloop.prototype.on = function (key, fn, ...args) {
        const objMap = this.eventobj[key] || [];
        Object.keys(objMap).map(item => {
            if (item.fnCb == fn) return false;
        })
        this.eventobj[key] = objMap.concat({
            fn: arguments => fn(...arguments, ...args),
            fnCb: fn
        })
    };
    Eventloop.prototype.emit = function (key, ...args) {
        this.eventobj[key].forEach(item=>{
            item.fn.apply(null,args)
        })
    };
    Eventloop.prototype.listeners = function (key, fn) {
        const  funs = function(...args) {
               fn.apply(null,args);
               this.off(key,funs)
        }
        this.on(key,funs)
    };
    Eventloop.prototype.off = function (key, fn) {
       if(arguments.length == 1)  delete  this.eventobj[key] ;
       this.eventobj[key] = this.eventobj[key].filter(item => item.fn !==fn);
    }


}

// 请使用原生代码实现一个Events模块，可以实现自定义事件的订阅、触发、移除功能
const fn1 = (...args) => console.log('I want sleep1', ...args)
const fn2 = (...args) => console.log('I want sleep2', ...args)
const events = new Events();
events.on('sleep', fn1, 1, 2, 3);
events.on('sleep', fn2, 1, 2, 3);
events.emit('sleep', 4, 5, 6);
// I want sleep1 1 2 3 4 5 6
// I want sleep2 1 2 3 4 5 6
events.off('sleep', fn1);
events.listeners('sleep', () => console.log('I want sleep'));
events.emit('sleep');
// I want sleep2 1 2 3
// I want sleep
events.emit('sleep');
// I want sleep2 1 2 3


