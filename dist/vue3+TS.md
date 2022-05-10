## vue2和vue3的对比

#### 一、基本概念

1. vue2采用静态类型校验flow编写，vue3则采用的是TS编写。
2. vue2采用Object.defineProperty()来递归进行数据劫持，vue3则采用Proxy，性能大大提升。
3. vue2采用OptionsAPI，vue3采用的是CompositionAPI。
4. vue3优化了编译过程，采用静态模板分析、重写了diff算法。
5. vue3优化了打包，采用tree-shaking，剔除没有用到的API代码，前端包更小。

#### 二、TS简介

- 常用数据类型

  ```typescript
  /* 基本数据类型的使用 */
  // ts中冒号后面的基本都是类型
  // number 数字类型  TypeScript和JavaScript一样，不区分整数类型（int）和浮点型（double），统一为number类型。
  // TypeScript也是支持二进制、八进制、十六进制
  let num: number;
  num = 100; // 十进制
  num = 0b100; // 二进制
  num = 0o100; // 八进制
  num = 0x100; // 十六进制
  
  // boolean 布尔类型
  let bool: boolean;
  bool = true;
  bool = false;
  
  // string 字符串类型
  const name: string = "zhongfu";
  
  // symbol 类型
  const s1: symbol = Symbol("name");
  const s2: symbol = Symbol("name");
  
  const nameObj = {
    s1: "zs",
    s2: "ls",
  };
  
  // 联合类型
  let data: string | number | undefined = "hello world";
  data = 666;
  data = undefined;
  
  // Array 数组类型 (两种声明方式)
  const numArr: number[] = [1, 2, 3];
  const strArr: Array<string> = ["", "1", "2"];
  
  // object 对象类型 用于描述一个对象(不推荐使用) 既不能获取数据 也不能设置数据
  // 可选类型 可以用在对象或函数中 可以看作是定义的类型和undefined类型的联合类型
  // 建议使用 {} 形式具体定义对象
  const cat: object = {
    name: "tom",
    age: "18",
  };
  
  // cat.name = 'jerry'
  // console.log(cat.age)
  
  const person: { name: string; age: number; hobby?: string } = {
    name: "zs",
    age: 24,
    // hobby: "eat",
  };
  
  // undefined 和 null
  let n: null = null;
  let un: undefined = undefined;
  
  // tuple 元组类型
  const tuple: [string, number, boolean] = ["hehe", 6, true];
  
  // 枚举
  enum job {
    TEACHER,
    STUDENT,
    DOCTOR,
  }
  
  // void类型 通常用来指定一个函数是没有返回值或着返回值为null或undefined，那么它的返回值就是void类型
  function voidFunc1(a: string, b: number) {}
  const voidFunc2 = (a: string, b: number): void => null;
  const voidFunc3 = (a: string, b: number): void => undefined;
  
  // any类型 (尽量少用) 丢失类型检测
  /*
   *  使用场景
   *	  1.当无法确定一个变量的类型，并且可能它会发生多种变化
   *    2.某些情况的处理过于繁琐不希望添加规定的类型注解
   *    3.在引入一些第三方库时，缺失了类型注解
   */
  let a: any = 666;
  a = "tom";
  a = true;
  
  // unknown类型 (尽量少用) 用于描述类型不确定的变量
  let u: unknown;
  let flag = Math.floor(Math.random() * 10) % 2 === 0;
  if (flag) {
    u = 18;
  } else {
    u = "tom";
  }
  
  // never类型 一个函数中是一个死循环或者抛出一个异常
  function loopFunc(): never {
    while (true) {
      console.log("loop");
    }
  }
  
  function errorFunc(): never {
    throw new Error("system error!");
  }
  
  // 类型别名 type
  type Id = string | number;
  type UserInfo = {
    id: Id;
    name: string;
    age: number;
  };
  const getUserInfo = (id: Id): UserInfo => {
    return {
      id: 5,
      name: "tom",
      age: 18,
    };
  };
  
  // 类型断言 as
  const imgEl = document.querySelector(".demo-img") as HTMLImageElement;
  // TypeScript只知道获取值的为HTMLElement类型 但并不知道是具体的图像元素
  
  // 非空断言 !
  function toUpper(msg?: string) {
    console.log(msg!.toUpperCase());
  }
  
  toUpper("hello");
  
  // 字面量类型  通常和联合类型一起使用
  let hello: "hello" = "hello";
  // hello = 'world'
  
  const request = (url: string, method: "GET" | "POST" | "PUT" | "DELETE") => {};
  
  export {};
  ```

  

- 函数定义

  ```typescript 
  /* 定义函数的4种方式 */
  /* way1 */
  function func(a: string, b: string) {
    return a + b;
  }
  
  /* way2 */
  const funcExpr = (a: string, b: string): string => a + b;
  
  /* way3 */
  type funcType = (a: string, b: string) => string;
  const funcTypeImplement: funcType = (a, b) => a + b;
  
  /* way4 */
  interface funcInterface {
    (a: number, b: number): number;
  }
  const funcInterfaceImplement: funcInterface = (a, b) => a + b;
  
  // 剩余参数
  function sum(...nums: Array<number>) {
    return nums.reduce((prev, current) => prev + current, 0);
  }
  
  console.log(sum(1, 2, 3, 5, 9));
  
  export {};
  ```

- interface

  ```typescript
  // interface 描述对象的样貌
  interface Person {
    readonly name: string;
    age?: number;
  }
  
  const person: Person = {
    name: "ajuna",
    age: 18,
  };
  
  // 接口的继承
  interface Student extends Person {
    job: string;
  }
  
  const student: Student = {
    ...person,
    job: "student",
  };
  
  // 任意类型
  interface noLimit {
    [key: string]: any;
  }
  const possibly: noLimit = {
    ...student,
    hobby: ["eat", "sleep"],
  };
  
  // 交叉类型 通常对对象使用交叉类型
  interface Ability {
    fly: () => void;
  }
  
  type SurperMan = Person & Ability;
  
  const superMan: SurperMan = {
    name: "tom",
    age: 16,
    fly: () => {},
  };
  
  /* interface 和 type 区别*/
  // 一般情况下，非对象类型推荐使用type 
  // interface和type都能用来声明函数和对象 interface不能声明基本类型 而type可以
  // type可以设置联合类型 交叉类型 interface只能继承(extends)
  // interface可以声明合并 而type不行
  
  export {};
  ```

- 泛型

  ```typescript
  // 泛型
  const gen = <T>(n: number, value: T): Array<T> => {
    const ary = [];
    let i = 0;
    for (; i < n; i++) {
      ary.push(value);
    }
    return ary;
  };
  
  interface Student {
    name: string;
    age: number;
  }
  
  const student: Student = {
    name: "zs",
    age: 18,
  };
  
  const strAry = gen(5, "hello");
  const stuAry = gen(5, student);
  
  console.log(strAry, stuAry);
  ```

#### 三、vue3简介及其语法使用

1. 生命周期的变化

   ```typescript
   // beforeCreate => setup
   // created => setup
   // beforeMount => onBeforeMount
   // mounted => onMounted
   // beforeUpdate => onBeforeUpdate
   // updated => onUpdated
   // beforeDestroy => onBeforeUnmount
   // Destroy => onUnmounted
   ```

2. ref 与 reactive的使用

3. readonly的使用

4. computed的使用

5. watch和watchEffect的使用

6. hooks的使用

7. 自定义指令的使用

   ```typescript
   // 当需要对DOM进行底层操作的时候会使用自定义指令。
   // 自定义指令的生命周期
   // created 在元素的attribute 或事件侦听器应用之前调用
   // beforeMount 当指令第一次绑定到元素并在挂载到父组件之前调用
   // mounted 在绑定元素的父组件被挂载后调用
   // beforeUpdate	在更新包含组件的VNode之前调用
   // updated	在包含组件的VNode及其子组件的VNode更新后调用
   // beforeUnmount  在卸载绑定元素的父组件之前调用
   // unmonted 当指令与元素解除绑定并且父组件已卸载时调用
   ```


#### 四、vue3状态管理工具pinia

##### 1、pinia特点：

- 完整的 typescript 的支持；
- 足够轻量，压缩后的体积只有1.6kb;
- 去除 mutations，只有 state，getters，actions（这是我最喜欢的一个特点）；
- actions 支持同步和异步；
- 没有模块嵌套，只有 store 的概念，store 之间可以自由使用，更好的代码分割；
- 无需手动添加 store，store 一旦创建便会自动添加；

##### 2、安装：

``` node
npm install pinia --save
```

#####  3、创建并使用store

(1)新建 src/store 目录并在其下面创建 index.ts，导出 store

``` typescript
// src/store/index.ts
import { createPinia } from 'pinia'
const store = createPinia()
export default store
```

(2)在 main.ts 中引入并使用

``` typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
const app = createApp(App)
app.use(store)
```

(3)定义state,在 src/store 下面创建一个user.ts

```typescript
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      name: '张三'
    }
  }
})
```

(4)获取state

```typescript
<template>
  <div>{{ userStore.name }}</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 或者结合computed 使用
// import {computed} from 'vue'
// const name = computed(() => userStore.name)

//state 也可以使用解构，但使用解构会使其失去响应式，这时候可以用 pinia 的 storeToRefs
//import { storeToRefs } from 'pinia'
//const { name } = storeToRefs(userStore)
</script>
```

(5)修改 state

```typescript
//直接修改（不推荐）
userStore.name = '李四'
```

```typescript
//建议通过 actions 去修改 state，action 里可以直接通过 this 访问
export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      name: '张三'
    }
  },
  actions: {
    updateName(name) {
      this.name = name
    }
  }
})
```

```typescript
<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
userStore.updateName('李四')
</script>
```

(6)Getters

```typescript
export const useUserStore = defineStore({
 id: 'user',
 state: () => {
   return {
     name: '张三'
   }
 },
 getters: {
   fullName: (state) => {
     return state.name + '丰'
   }
 }
})
```

```typescript
//使用
userStore.fullName 
```

（7）action

异步action：action 可以像写一个简单的函数一样支持 async/await 的语法。

```typescript
export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd)
      return data
    }
  }
})
```

action之间相互调用，直接用 this 访问即可。

```typescript
export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd)
      this.setData(data) // 调用另一个 action 的方法
      return data
    },
    setData(data) {
      console.log(data)
    }
  }
})
```

在 action 里调用其他 store 里的 action ，引入对应的 store 后即可访问其内部的方法了。

```typescript
// src/store/user.ts

import { useAppStore } from './app'
const appStore= useAppStore()
export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd)
      const appStore = useAppStore()
      appStore.setData(data) // 调用 app store 里的 action 方法
      return data
    }
  }
})
```

``` typescript
// src/store/app.ts

export const useAppStore = defineStore({
  id: 'app',
  actions: {
    setData(data) {
      console.log(data)
    }
  }
})
```

##### 4、数据持久化

(1）插件安装

``` node
npm i pinia-plugin-persist --save
```

 (2)  使用

``` typescript
// src/store/index.ts

import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const store = createPinia()
store.use(piniaPluginPersist)

export default store
```

(3)在对应的 store 里开启 persist 

``` typescript
export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      name: '张三'
    }
  },
  
  // 开启数据缓存
  persist: {
    enabled: true
  }
})

//数据默认存在 sessionStorage 里，并且会以 store 的 id 作为 key
```

(4) 自定义key

可以在 strategies 里自定义 key 值，并将存放位置由 sessionStorage 改为 localStorage。

``` typescript
persist: {
  enabled: true,
  strategies: [
    {
      key: 'my_user',
      storage: localStorage,
    }
  ]
}
```

  (5) 持久化部分 state

```typescript
state: () => {
  return {
    name: '张三',
    age: 18,
    gender: '男'
  }  
},

persist: {
  enabled: true,
  strategies: [
    {
      storage: localStorage,
      paths: ['name', 'age']
    }
  ]
}
//上面只持久化 name 和 age，并将其改为localStorage, 而 gender 不会被持久化，如果其状态发送更改，页面刷新时将会丢失，重新回到初始状态，而 name 和 age 则不会。
```

 (6) 更多可看pinia官方文档

https://pinia.vuejs.org/
