// 性能监控工具
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

// 性能指标回调
function sendToAnalytics({ name, delta, id }) {
  console.log('性能指标:', {
    name,
    delta,
    id
  })
  
  // 这里可以添加发送到分析服务的逻辑
  // 例如：
  // fetch('/api/stats/performance', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ name, delta, id })
  // })
}

// 初始化性能监控
export function initPerformanceMonitoring() {
  // 累积布局偏移
  onCLS(sendToAnalytics)
  
  // 首次输入延迟
  onFID(sendToAnalytics)
  
  // 首次内容绘制
  onFCP(sendToAnalytics)
  
  // 最大内容绘制
  onLCP(sendToAnalytics)
  
  // 首字节时间
  onTTFB(sendToAnalytics)
  
  console.log('性能监控已初始化')
}

// 手动测量性能
export function measurePerformance(name, fn) {
  const start = performance.now()
  
  try {
    return fn()
  } finally {
    const end = performance.now()
    const duration = end - start
    
    console.log(`${name} 执行时间: ${duration.toFixed(2)}ms`)
    
    // 这里可以添加发送到分析服务的逻辑
  }
}

// 获取页面加载时间
export function getPageLoadTime() {
  const navigationTiming = performance.getEntriesByType('navigation')[0]
  
  if (navigationTiming) {
    return {
      navigationStart: navigationTiming.navigationStart,
      unloadEventStart: navigationTiming.unloadEventStart,
      unloadEventEnd: navigationTiming.unloadEventEnd,
      redirectStart: navigationTiming.redirectStart,
      redirectEnd: navigationTiming.redirectEnd,
      fetchStart: navigationTiming.fetchStart,
      domainLookupStart: navigationTiming.domainLookupStart,
      domainLookupEnd: navigationTiming.domainLookupEnd,
      connectStart: navigationTiming.connectStart,
      connectEnd: navigationTiming.connectEnd,
      secureConnectionStart: navigationTiming.secureConnectionStart,
      requestStart: navigationTiming.requestStart,
      responseStart: navigationTiming.responseStart,
      responseEnd: navigationTiming.responseEnd,
      domLoading: navigationTiming.domLoading,
      domInteractive: navigationTiming.domInteractive,
      domContentLoadedEventStart: navigationTiming.domContentLoadedEventStart,
      domContentLoadedEventEnd: navigationTiming.domContentLoadedEventEnd,
      domComplete: navigationTiming.domComplete,
      loadEventStart: navigationTiming.loadEventStart,
      loadEventEnd: navigationTiming.loadEventEnd,
      // 计算各种指标
      redirectTime: navigationTiming.redirectEnd - navigationTiming.redirectStart,
      lookupTime: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
      connectTime: navigationTiming.connectEnd - navigationTiming.connectStart,
      requestTime: navigationTiming.responseEnd - navigationTiming.requestStart,
      responseTime: navigationTiming.responseEnd - navigationTiming.responseStart,
      domProcessingTime: navigationTiming.domComplete - navigationTiming.domLoading,
      totalLoadTime: navigationTiming.loadEventEnd - navigationTiming.navigationStart
    }
  }
  
  return null
}

// 监控资源加载性能
export function monitorResourcePerformance() {
  const resources = performance.getEntriesByType('resource')
  
  const resourceStats = resources.map(resource => ({
    name: resource.name,
    type: resource.initiatorType,
    duration: resource.duration,
    transferSize: resource.transferSize,
    startTime: resource.startTime,
    responseEnd: resource.responseEnd
  }))
  
  console.log('资源加载性能:', resourceStats)
  
  return resourceStats
}