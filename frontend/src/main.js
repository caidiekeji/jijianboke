import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import analytics from './utils/analytics.js'
import { initPerformanceMonitoring } from './utils/performance.js'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// 全局属性
try {
  app.config.globalProperties.$analytics = analytics
} catch (e) {
  console.error('Error setting global properties:', e)
}

app.use(router)
app.use(pinia)

// 初始化访问统计
analytics.init()

// 路由切换时自动追踪页面访问
router.afterEach((to) => {
  analytics.trackPageView(to.path)
})

// 初始化性能监控
initPerformanceMonitoring()

app.mount('#app')