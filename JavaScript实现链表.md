## JavaScript实现链表

最近在LeetCode上做了一个题目《两数之和》，话不说多说上题目！！

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/01/02/addtwonumber1.jpg)

 

示例 1：

输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
示例 2：

输入：l1 = [0], l2 = [0]
输出：[0]
示例 3：

输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]


提示：

每个链表中的节点数在范围 [1, 100] 内
0 <= Node.val <= 9
题目数据保证列表表示的数字不含前导零

来源：力扣（LeetCode）

![image-20230329161432477](/Users/caifuling/Library/Application Support/typora-user-images/image-20230329161432477.png)

第一次接触到链表的前端小伙伴一定很蒙蔽！！什么玩意?  链表？JavaScript有链表么？ 原型链算吗?

那么首先我先普及下链表的知识：

链表是数据结构之一的一种存储方式，是非连续、非顺序的[存储结构](https://baike.baidu.com/item/存储结构/350782?fromModule=lemma_inlink)，[数据元素](https://baike.baidu.com/item/数据元素/715313?fromModule=lemma_inlink)的逻辑顺序是通过链表中的[指针](https://baike.baidu.com/item/指针/2878304?fromModule=lemma_inlink)链接次序实现的。

其中分为单向链表和双向链表，其中指针非常类似原型链中的原型指针_proto
![image-20230329162940619](/Users/caifuling/Library/Application Support/typora-user-images/image-20230329162940619.png)



而LeetCode给我们的是ListNode

```
  function ListNode(val, next) {
      this.val = (val===undefined ? 0 : val)
      this.next = (next===undefined ? null : next)
  }
```

很明显不能满足我们链表的需求,所以我们要在ListNode 的基础上做增强！

首先我们要 定义一个 Node 类来表示链表中的每个节点的链

```
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
```

其中data表示这个节点的存储单元，而next则表示这个node节点指针的指向。

然后我们再定义一个 LinkedList 类来表示链表

```
class LinkedList {
  constructor() {
    this.head = null;  // head 表示做多个链存储的表
    this.size = 0;  // size 表示这个链表存储单元数量
  }
}
```

ojbk！ 咱们定义了LinkedList,  还缺什么呢？  嗯，四字真言 增删改查！那就再定义一个 在链表末尾添加一个新节点的方法 add

```
add(data) {
    const node = new Node(data); // 存入值

    if (!this.head) {  // 如果表为空就创建一个链节点
      this.head = node;
    } else {
      let current = this.head;  
    
      while (current.next) {  // 定义链表指向
        current = current.next;
      }
    
      current.next = node; // 链表末尾添加一个新节点
    }
    
    this.size++; // 更新存储单元数量

  }

```



既然有了新增链表的方法 那么我们就需要删除链表的方法 remove 。



```
remove(data) {
    let current = this.head;
    let previous = null;

    while (current) {  
      if (current.data === data) { // 寻找删除链的节点
        if (!previous) {
          this.head = current.next;
        } else {
          previous.next = current.next;
        }
    
        this.size--;   //  更新链表大小
        return current.data;
      }
    
      previous = current;
      current = current.next;
    }
    
    return null;
  }
```



接下来就是查了 get 方法的实现（获取指定索引处节点的数据）

```
get(index) {  
    if (index < 0 || index >= this.size) {  // 校验索引值 和 链表存储数量
      return null;
    }

    let current = this.head;
    let count = 0;
    
    while (count < index) {  // 循环寻找对应链表值
      current = current.next;
      count++;
    }
    
    return current.data; 

  }
```

还有修改链表节点的set的方法



```
  set(index, data) {
    if (index < 0 || index >= this.size) {
      return null;
    }

    let current = this.head;
    let count = 0;
    
    while (count < index) {
      current = current.next;
      count++;
    }
    
    current.data = data;  // 修改链表中指定索引处节点的数据

  }


```

搞定了 增删改查  ！！ 但是还要差一个方法 ，因为题目是要输出数组，所以我们还得一个toArray的方法

```
 toArray() {
    const array = [];
    let current = this.head;

    while (current) {
      array.push(current.data);   // 将链表转换为数组
      current = current.next;
    }
    
    return array;

  } 
```

终于大功告成了！  做个题目还有搞这么多前期工作 ，LeetCode 就不能直接写好给我么 ！！！

接下来咱们试一试

```
// 创建一个新的链表
const list = new LinkedList();

// 向链表中添加一些节点
list.add(1);
list.add(2);
list.add(3);

// 从链表中删除一个节点
list.remove(2);

// 从链表中更新一个节点
list.set(1,5);

// 获取链表的大小
console.log(list.getSize()); // 输出：2

// 获取指定索引处节点的数据
console.log(list.get(1)); // 输出：5

// 将链表转换为数组
console.log(list.toArray()); // 输出：[1,5]

```

链表的功能都没有问题 ，接来下我们开始做题了

两数之和

```
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
 

const addTwoNumbers = function(l1, l2) {
    let list3 = new LinkedList(); // 创建新的链表
    let carry = 0;
    let index = 0;
    while (l1 || l2 || carry) {
        let sum = (l1 ? l1.get(index) : 0) + (l2 ? l2.get(index) : 0) + carry;
        carry = Math.floor(sum / 10);   
        list3.add(sum % 10);
        index+=1;
        l1 = l1.get(index) ? l1 : null;
        l2 = l2.get(index) ?  l2 : null;
    }
    return list3.toArray()
};

const list1 = new LinkedList(); // 创建链表l1
const list2 = new LinkedList(); // 创建链表l2
// 对应数值写入链表
list.add(2);list.add(4);list.add(3); 
list2.add(5);list2.add(6);list2.add(4);

addTwoNumbers(list1,list2)  //  [7,0,8]


```



到这里基本上结束了，其实写这篇文章主要是在其他语言都是有ListNode类，无奈JS没有 ，而LeetCode默认Js有 ，这样会让很多前端的小伙伴看的一脸懵逼。所以写一下js链表实现的过程方便打击理解做题

