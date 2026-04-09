const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// 生成密码哈希
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// 种子数据
async function seed() {
  try {
    console.log('开始生成种子数据...');

    // 创建管理员用户
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.create({
      data: {
        name: '管理员',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        status: 'active'
      }
    });
    console.log('创建管理员用户:', admin.email);

    // 创建普通用户
    const userPassword = await hashPassword('user123');
    const user = await prisma.user.create({
      data: {
        name: '普通用户',
        email: 'user@example.com',
        password: userPassword,
        role: 'user',
        status: 'active'
      }
    });
    console.log('创建普通用户:', user.email);

    // 创建分类
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: '技术',
          slug: 'tech',
          order: 1
        }
      }),
      prisma.category.create({
        data: {
          name: '生活',
          slug: 'life',
          order: 2
        }
      }),
      prisma.category.create({
        data: {
          name: '学习',
          slug: 'study',
          order: 3
        }
      })
    ]);
    console.log('创建分类:', categories.map(c => c.name).join(', '));

    // 创建标签
    const tags = await Promise.all([
      prisma.tag.create({
        data: {
          name: 'JavaScript',
          slug: 'javascript'
        }
      }),
      prisma.tag.create({
        data: {
          name: 'Vue',
          slug: 'vue'
        }
      }),
      prisma.tag.create({
        data: {
          name: 'Node.js',
          slug: 'nodejs'
        }
      }),
      prisma.tag.create({
        data: {
          name: '生活感悟',
          slug: 'life-thought'
        }
      }),
      prisma.tag.create({
        data: {
          name: '学习笔记',
          slug: 'study-note'
        }
      })
    ]);
    console.log('创建标签:', tags.map(t => t.name).join(', '));

    // 创建文章
    const posts = await Promise.all([
      prisma.post.create({
        data: {
          title: 'Vue 3 新特性详解',
          slug: 'vue-3-features',
          content: `# Vue 3 新特性详解

Vue 3 带来了许多令人兴奋的新特性，包括 Composition API、Teleport、Fragments 等。本文将详细介绍这些新特性，并提供使用示例。

## Composition API

Composition API 是 Vue 3 中最显著的变化之一，它提供了一种新的方式来组织组件逻辑，使代码更加可维护和可复用。

### 基本用法

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const title = ref('Hello Vue 3')
const count = ref(0)

const increment = () => {
  count.value++
}
</script>
```

## Teleport

Teleport 允许你将组件的内容渲染到 DOM 树的其他位置，这对于模态框、通知等组件非常有用。

### 基本用法

```vue
<template>
  <teleport to="#modal-container">
    <div class="modal">
      <h2>模态框标题</h2>
      <p>模态框内容</p>
      <button @click="close">关闭</button>
    </div>
  </teleport>
</template>
```

## Fragments

Fragments 允许组件返回多个根节点，而不需要包裹在一个父元素中。

### 基本用法

```vue
<template>
  <h1>标题</h1>
  <p>内容</p>
  <button>按钮</button>
</template>
```

Vue 3 还带来了许多其他改进，如更好的 TypeScript 支持、更小的包体积、更快的渲染速度等。如果你还没有尝试过 Vue 3，现在是时候开始了！`,
          excerpt: 'Vue 3 带来了许多令人兴奋的新特性，包括 Composition API、Teleport、Fragments 等。本文将详细介绍这些新特性，并提供使用示例。',
          cover: 'https://picsum.photos/800/400',
          status: 'published',
          authorId: admin.id,
          categoryId: categories[0].id,
          tags: {
            create: [
              { tag: { connect: { id: tags[0].id } } },
              { tag: { connect: { id: tags[1].id } } }
            ]
          }
        }
      }),
      prisma.post.create({
        data: {
          title: 'Node.js 性能优化技巧',
          slug: 'nodejs-performance-optimization',
          content: `# Node.js 性能优化技巧

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，它提供了一种高效的方式来构建服务器端应用。然而，要充分发挥 Node.js 的性能潜力，需要掌握一些优化技巧。

## 1. 使用适当的模块系统

Node.js 支持 CommonJS 和 ES 模块两种模块系统。在 Node.js 12+ 中，ES 模块提供了更好的性能和更清晰的语法。

```javascript
// ES 模块
import fs from 'fs/promises';

async function readFile() {
  const content = await fs.readFile('file.txt', 'utf8');
  console.log(content);
}
```

## 2. 合理使用缓存

缓存是提高性能的有效方法，尤其是对于频繁访问的数据。

```javascript
const cache = new Map();

async function getData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchDataFromDatabase(key);
  cache.set(key, data);
  return data;
}
```

## 3. 使用异步操作

Node.js 是单线程的，因此使用异步操作可以避免阻塞事件循环。

```javascript
// 避免这样做
const data = fs.readFileSync('file.txt');
console.log(data);

// 推荐这样做
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

## 4. 优化数据库查询

数据库查询是应用性能的关键因素之一。

- 使用索引
- 减少查询次数
- 优化查询语句
- 使用连接池

## 5. 监控和分析

使用工具如 PM2、New Relic 或 Node Clinic 来监控和分析应用性能。

通过以上技巧，你可以显著提高 Node.js 应用的性能，为用户提供更好的体验。`,
          excerpt: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，它提供了一种高效的方式来构建服务器端应用。然而，要充分发挥 Node.js 的性能潜力，需要掌握一些优化技巧。',
          cover: 'https://picsum.photos/800/400?random=2',
          status: 'published',
          authorId: admin.id,
          categoryId: categories[0].id,
          tags: {
            create: [
              { tag: { connect: { id: tags[2].id } } }
            ]
          }
        }
      }),
      prisma.post.create({
        data: {
          title: '生活中的小确幸',
          slug: 'small-happiness-in-life',
          content: `# 生活中的小确幸

生活中，我们常常追求大的目标和成就，却往往忽略了身边的小确幸。这些看似微不足道的瞬间，其实是构成我们幸福生活的重要部分。

## 早晨的阳光

每天早晨，当第一缕阳光透过窗户洒进房间，那种温暖的感觉让人心情愉悦。这是一天中最美好的开始。

## 一杯热咖啡

在寒冷的冬日，一杯热咖啡不仅能温暖身体，更能温暖心灵。它是忙碌生活中的片刻休憩。

## 与朋友的聚会

和朋友一起聊天、吃饭、看电影，这些简单的活动能带来无尽的快乐。友谊是生活中最珍贵的财富。

## 阅读一本好书

沉浸在一本好书中，仿佛进入了另一个世界。这是一种精神上的享受，也是一种自我提升的方式。

## 运动后的放松

运动不仅能保持身体健康，还能释放压力，带来身心的放松。那种大汗淋漓后的感觉，是一种难以言喻的满足。

生活中的小确幸无处不在，只要我们用心去感受，就能发现它们的存在。让我们珍惜这些瞬间，让生活变得更加美好。`,
          excerpt: '生活中，我们常常追求大的目标和成就，却往往忽略了身边的小确幸。这些看似微不足道的瞬间，其实是构成我们幸福生活的重要部分。',
          cover: 'https://picsum.photos/800/400?random=3',
          status: 'published',
          authorId: user.id,
          categoryId: categories[1].id,
          tags: {
            create: [
              { tag: { connect: { id: tags[3].id } }
            ]
          }
        }
      }),
      prisma.post.create({
        data: {
          title: '学习 JavaScript 的最佳方法',
          slug: 'best-way-to-learn-javascript',
          content: `# 学习 JavaScript 的最佳方法

JavaScript 是一门广泛使用的编程语言，它不仅用于网页开发，还用于服务器端、移动应用和游戏开发。如果你想学习 JavaScript，以下是一些最佳方法。

## 1. 从基础开始

掌握 JavaScript 的基础知识是非常重要的。你需要了解变量、数据类型、函数、对象、数组等基本概念。

```javascript
// 变量声明
let name = 'John';
const age = 30;
var isStudent = true;

// 函数
function greet(name) {
  return 'Hello, ' + name + '!';
}

// 箭头函数
const greet = (name) => {
  return 'Hello, ' + name + '!';
};
```

## 2. 实践是最好的学习方式

理论学习固然重要，但实践是掌握 JavaScript 的关键。尝试创建小项目，解决实际问题。

## 3. 学习现代 JavaScript

JavaScript 不断发展，新的特性和语法不断出现。学习 ES6+ 的特性，如箭头函数、模板字符串、解构赋值等。

```javascript
// 模板字符串
const name = 'John';
const message = `Hello, ${name}!`;

// 解构赋值
const { firstName, lastName } = person;

// 展开运算符
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
```

## 4. 学习框架和库

JavaScript 生态系统中有许多优秀的框架和库，如 React、Vue、Angular 等。选择一个适合你的框架，深入学习它。

## 5. 参与社区

加入 JavaScript 社区，参与讨论，分享你的知识和经验。这不仅能帮助你学习，还能建立人脉。

学习 JavaScript 需要时间和努力，但只要你坚持下去，就一定能掌握这门强大的编程语言。`,
          excerpt: 'JavaScript 是一门广泛使用的编程语言，它不仅用于网页开发，还用于服务器端、移动应用和游戏开发。如果你想学习 JavaScript，以下是一些最佳方法。',
          cover: 'https://picsum.photos/800/400?random=4',
          status: 'published',
          authorId: user.id,
          categoryId: categories[2].id,
          tags: {
            create: [
              { tag: { connect: { id: tags[0].id } } },
              { tag: { connect: { id: tags[4].id } } }
            ]
          }
        }
      })
    ]);
    console.log('创建文章:', posts.map(p => p.title).join(', '));

    // 创建评论
    const comments = await Promise.all([
      prisma.comment.create({
        data: {
          content: '这篇文章写得非常好，对我很有帮助！',
          postId: posts[0].id,
          authorId: user.id,
          status: 'approved'
        }
      }),
      prisma.comment.create({
        data: {
          content: '谢谢分享，学到了很多新知识。',
          postId: posts[1].id,
          authorId: admin.id,
          status: 'approved'
        }
      }),
      prisma.comment.create({
        data: {
          content: '写得很真实，生活中的小确幸确实很重要。',
          postId: posts[2].id,
          authorId: admin.id,
          status: 'approved'
        }
      })
    ]);
    console.log('创建评论:', comments.length, '条');

    // 创建网站设置
    const settings = await Promise.all([
      prisma.setting.create({
        data: {
          id: 'siteTitle',
          value: '我的博客'
        }
      }),
      prisma.setting.create({
        data: {
          id: 'siteDescription',
          value: '分享技术、记录生活、探索未知'
        }
      }),
      prisma.setting.create({
        data: {
          id: 'siteKeywords',
          value: '博客, 技术, 生活, 学习'
        }
      }),
      prisma.setting.create({
        data: {
          id: 'enableAnalytics',
          value: 'true'
        }
      }),
      prisma.setting.create({
        data: {
          id: 'enableRss',
          value: 'true'
        }
      }),
      prisma.setting.create({
        data: {
          id: 'enableSitemap',
          value: 'true'
        }
      })
    ]);
    console.log('创建网站设置:', settings.length, '项');

    console.log('种子数据生成完成！');
  } catch (error) {
    console.error('生成种子数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();