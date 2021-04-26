// Object的变化时通过setter来追踪的，只有某个数据发生了变化，
// 就一定会触发这个数据上的setter。但是Array型数据没有setter
// 可以把这些方法都重写一遍，在不改变原有功能的前提, 监听数组 如下
import {  Dep as dep } from "./Observer";

let arr = [1, 2, 3];
arr.push(4);
Array.prototype.newPush = function (val) {
  console.log("arr被修改了");
  this.push(val);
};
arr.newPush(4);

// Vue中创建了一个数组方法拦截器
// 源码位置：/src/core/observer/array.js

// 创建了继承自Array原型的空对象arrayMethods
const arrayProto: object = Array.prototype;

// 创建一个对象做为拦截器

const arrayMethods: Object = Object.create(arrayProto);

// 会改变数字自身内容的方法

const methodsToPatch: string[] = [
  "push",
  "pop",
  "sort",
  "shift",
  "unshift",
  "reverse",
];

function def (obj, key, val, enumerable?) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}


//  arrayMethods上使用object.defineProperty方法将那些可以改变数组自身的7个方法遍历逐个进行封装
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
   def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args; // 如果是push或unshift方法，那么传入参数就是新增的元素
        break;
      case "splice":
        inserted = args.slice(2); // 如果是splice方法，那么传入参数列表中下标为2的就是新增的元素
        break;
    }
    if (inserted) ob.observeArray(inserted); // 调用observe函数将新增的元素转化成响应式
    // notify change
    ob.dep.notify();
    return result;
  });
});

// 挂载到数组实例与Array.prototype之间，让拦截器能够生效

// 判断__proto__是否可用，因为有的浏览器不支持该属性
const hasProto: boolean = "__proto__" in {};

const arrayKeys: string[] = Object.getOwnPropertyNames(arrayMethods);

function protoAugment(target, src: Object, keys) {
  target._proto_ = src;
}

function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key: string = keys[i];
    def(target, key, src[key]);
  }
}

export class Observer {
  value: any;
  dep: any;

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value); // 将数组中的所有元素都转化为可被侦测的响应式
    } else {
      // this.walk(value)
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

export function observe(value, asRootData?: any) {
  if (!isObject(value) || value instanceof Node) {
    return;
  }
  let ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}

function isObject(value): boolean {
  return typeof value === "object";
}

function hasOwn(value: object, str): boolean {
  if (value.hasOwnProperty(str)) {
    return true;
  } else {
    false;
  }
}



let arras:number[] = [1,2,3]
arras[0] = 5;       // 通过数组下标修改数组中的数据
arras.length = 0    // 通过修改数组长度清空数组