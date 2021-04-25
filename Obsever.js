
// 对于vue 能够很直接的去对一个对象数据进行观测具体原理的一种探究

// 源码位置  src/core/observer/index.js   github 搜 vue

// 想知道数据什么时候被读取了或数据什么时候被改写了，其实不难，
// JS为我们提供了Object.defineProperty方法，通过该方法我们就可以轻松的知道数据在什么时候发生变化



let car = {}
let val = 3000
Object.defineProperty(car, 'price', {
  enumerable: true,
  configurable: true,
  get() {
    console.log('price属性被读取了')
    return val
  },
  set(newVal) {
    console.log('price属性被修改了')
    val = newVal
  }
})


// 通过Object.defineProperty()方法给car定义了一个price属性，
// 并把这个属性的读和写分别使用get()和set()进行拦截，每当该属性进行读或写操作的时候就会触发get()和set()


// 但是vue 源码里对于这个属性做了更加细节的处理 封装出了Observer的类

/**
 * @deprecated
 * Observer类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 */


// 源码位置：src/core/observer/dep.js
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }
  // 删除一个依赖
  removeSub(sub) {
    remove(this.subs, sub)
  }
  // 添加一个依赖
  depend() {
    if (window.target) {
      this.addSub(window.target)
    }
  }
  // 通知所有依赖更新
  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

/**
 * Remove an item from an array
 */
function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}


class Observer {

  constructor(props) {
    this.props = props;

    // Dep 给props新增一个__ob__属性，值为该props的Observer实例
    // 相当于为props打上标记，表示它已经被转化成响应式了，避免重复操作
    // vue/src/core/observer/dep.js 
    new Dep(props, '_ob_', this);

    if (Array. isArray(props)) {
      // 当value为数组时的逻辑
      // 后面加。。。  
    } else {
      this.walk(props);
    }
  }

  // 计步器
  walk(obj) {
    Object.keys(obj).forEach((item, index, arr) => {
      // 对象转化成可观测对象
      defineReactive(obj, arr[index])
    })
  }
}

/**
* 使一个对象转化成可观测对象
* @param { Object } obj 对象
* @param { String } key 对象的key
* @param { Any } val 对象的某个key的值
*/

function defineReactive(obj, key, val) {
  if (arguments.length === 2) {
    val = obj[key]
  }
  if (typeof val === 'object') {
    new Observer(val)
  }
  const dep = new Dep()  //实例化一个依赖管理器，生成一个依赖管理数组dep
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`${key}属性被读取了`);
      dep.depend()    // 在getter中收集依赖
      return val;
    },
    set(newVal) {
      console.log(`${key}属性被修改了`);
      if (val === newVal) {
        return
      }
      val = newVal;
      dep.notify()   // 在setter中通知依赖更新
    }
  })
}



let car = new Observer({
  'brand': 'BMW',
  'price': 3000
})