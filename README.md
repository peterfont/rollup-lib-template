# rollup-lib-template

## 总览

- 该项目支持输出类型: 
    - cjs
    - es
    - umd和umd.min.js。
- 该项目引入Rollup插件，解决以下问题: 
    - 引入NPM包 (npm install rollup-plugin-node-resolve -D)
    - 转化CommonJS模块 (npm install rollup-plugin-commonjs -D)
    - 集成Babel (npm install @babel/core @babel/preset-env core-js@2 rollup-plugin-babel -D)
    - 代码压缩问题 (npm i rollup-plugin-terser -D)
> 需要更多资源，参考: [Awesome Rollup](https://github.com/rollup/awesome)


## Rollup构建库文件

### Rollup和NPM第三方库，es模块，CommonJS模块?
#### Rollup默认支持es模块
项目内代码可以直接用es模块语法。
#### 第三方es模块

默认支持es模块的加载，可以直接output到es格式的bundle中, 以lodash-es模块为例。

代码：
```
// src/food.js
import { random } from 'lodash-es';

const FRUITS = ['🍏', '🍉', '🍇'];

const FAST_FOODS = ['🍔', '🍟', '🍕'];

const randomFruit = () =>
  FRUITS[random(0, FRUITS.length - 1)];

const randomFastFood = () =>
  FAST_FOODS[random(0, FRUITS.length - 1)];

export {
  FRUITS,
  FAST_FOODS,
  randomFruit,
  randomFastFood
};
```

直接引入的话会报错：
```
You'll get a warning that it can't resolve the lodash-es.

(!) Unresolved dependencies
https://rollupjs.org/guide/en#warning-treating-module-as-external-dependency
lodash-es (imported by src/food.js)
created dist/cjs.js in 32ms
```

注意：

> 如果您的库的用户碰巧在他们的项目上安装了lodash-es，那么这个包仍然可以工作。当然，这不是构建库的可靠方法。

幸运的是，已经有一个插件来帮助Rollup解析通过NPM安装的任何第三方模块:Rollup-plugin-node-resolve。

注意：
> 包的引入方式直接影响Tree-shake的效果，需要import random from 'lodash-es/random';这样引入，而不是import { random } from 'lodash-es';

#### CommonJs模块

直接引入CommonJs模块会报错：

```
src/main.js → dist2/cjs.js...
[!] Error: 'default' is not exported by node_modules/lodash/random.js
https://rollupjs.org/guide/en#error-name-is-not-exported-by-module-
src/food.js (1:7)
1: import random from 'lodash/random';
```

原来Rollup无法处理CommonJS格式。

幸运的是，已经有一个插件可以解决这个问题:rollup-plugin-commonjs。

这个插件将把任何CommonJS模块转换成ES模块格式。这样Rollup就可以处理它们。

但是需要注意:

> 如果您注册了其他也可以转换模块的插件，请确保rollup-plugin-commonjs出现在任何插件之前。这是为了防止其他插件做出可能破坏CommonJS检测的更改。


### Rollup处理公共依赖(Peer Dependencies)

可以通过external的方式处理公共依赖，

```
// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/umd.js',
      format: 'umd',
      name: 'eatFruit',
      globals: {
        'lodash/random': '_.random'
      }
    },
    {
      file: 'dist/iife.js',
      format: 'iife',
      name: 'eatFruit',
      globals: {
        'lodash/random': '_.random'
      }
    }
  ],
  plugins: [
    resolve(),
    commonjs()
  ],
  external: [
    'lodash/random'
  ]
};
```

注意：

> 如果您将包列为库的对等依赖项，请将所需的版本设置为尽可能宽松的版本。至少不要针对确切的补丁版本。这是为了避免版本与其他库不兼容。

### Rollup的TreeShake的简单原理？


### Rollup和babel? 

需要安装：

```
$ npm install @babel/core @babel/preset-env rollup-plugin-babel -D
```
可以通过，.babelrc和.browserslist 来指定babel环境。


### rollup-babel-plugin 和 babel7的兼容性？
babel-plugin-external-helpers废弃，不适合babel7，支持babel6？（文档未更新）

babel文档中：

```
This means you can use new built-ins like Promise or WeakMap, static methods like Array.from or Object.assign, instance methods like Array.prototype.includes, and generator functions (when used alongside the regenerator plugin). The polyfill adds to the global scope as well as native prototypes like String in order to do this.

这意味着您可以使用新的内置函数，如Promise或WeakMap，静态方法，如Array.from或Object。赋值，实例方法，比如Array.prototype。包含和生成器函数(当与regenerator插件一起使用时)。为了做到这一点，polyfill添加了全局范围和原生原型，比如String。
```

https://babeljs.io/docs/en/usage

同时指出，babel-polyfill和babel-plugin-transform-runtime都是过去式了！！！！

通过简单配置就可以实现实例方法（可以通过regenerator实现不污染全局变量）和静态方法的引入了。

```
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "browsers": ["ie <= 8"]
        },
        "useBuiltIns": "usage",
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ]
}
```
只需要安装， @babel/env 和 core-js@2.x/core-js@3版本，通过useBuiltIns指定引入方式即可。

简直完美了！！！

所以之前方案都可以废弃了。。。。。。。


### babel7.4升级后的polyfill的处理策略？@babel/plugin-transform-runtime导致打包体积过大的问题，在babel7.4以上版本轻松解决

答案上面有说明！

### Rollup和js代码压缩?



### Rollup同时输出不同格式的bundle？



## 收获


创建rollup-lib-template的项目

打通组件库项目的组件构建环节


### 遗留问题

rollup加载其他资源的问题， 图片，css，svg等的问题。
