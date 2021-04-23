function deepProxy(object, handler) {
    if (isComplexObject(object)) {
        addProxy(object, handler);
    }
    return new Proxy(object, handler);
}

function addProxy(obj, handler) {
    for (let i in obj) {
        if (typeof obj[i] === 'object') {
            if (isComplexObject(obj[i])) {
                addProxy(obj[i], handler);
            }
            obj[i] = new Proxy(obj[i], handler);
        }
    }
}

function isComplexObject(object) {
    if (typeof object !== 'object') {
        return false;
    } else {
        for (let prop in object) {
            if (typeof object[prop] == 'object') {
                return true;
            }
        }
    }
    return false;
}

let person = {
    txt: 123,
    name: 'tnt',
    age: 26,
    status: {
        money: 'less',
        fav: [1, 2, 3]
    }
};
let proxyObj = deepProxy(person, {
    get(target, key, receiver) {
        console.log(`get--${target}--${key}`);
        return Reflect.get(target, key);
    },
    set(target, key, value, receiver) {
        console.log(`set--${target}--${key}-${value}`);
        return Reflect.set(target, key, value);
    }
});
proxyObj.status.test = 13;
proxyObj.status.fav.push('33');