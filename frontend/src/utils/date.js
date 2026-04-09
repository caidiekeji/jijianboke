// 日期工具函数

/**
 * 格式化日期
 * @param {string|Date} date - 日期对象或日期字符串
 * @param {string} format - 格式类型: 'full', 'date', 'time', 'relative'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'full') {
  const d = new Date(date);
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    return '无效日期';
  }

  switch (format) {
    case 'full':
      return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    
    case 'date':
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    
    case 'time':
      return d.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'relative':
      return getRelativeTime(d);
    
    default:
      return d.toLocaleString('zh-CN');
  }
}

/**
 * 获取相对时间（如：3分钟前，2小时前）
 * @param {Date} date - 日期对象
 * @returns {string} 相对时间字符串
 */
export function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
}

/**
 * 检查日期是否是今天
 * @param {Date} date - 日期对象
 * @returns {boolean} 是否是今天
 */
export function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * 检查日期是否是昨天
 * @param {Date} date - 日期对象
 * @returns {boolean} 是否是昨天
 */
export function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
}

/**
 * 检查日期是否是本周
 * @param {Date} date - 日期对象
 * @returns {boolean} 是否是本周
 */
export function isThisWeek(date) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return date >= weekStart && date <= weekEnd;
}

/**
 * 检查日期是否是本月
 * @param {Date} date - 日期对象
 * @returns {boolean} 是否是本月
 */
export function isThisMonth(date) {
  const now = new Date();
  return date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

/**
 * 格式化日期范围
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {string} 格式化后的日期范围
 */
export function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '无效日期范围';
  }
  
  // 检查是否是同一天
  if (start.getDate() === end.getDate() &&
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()) {
    return formatDate(start, 'full');
  }
  
  // 检查是否是同一月
  if (start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()) {
    return `${start.getMonth() + 1}月${start.getDate()}日 ${start.getHours()}:${start.getMinutes()} - ${end.getDate()}日 ${end.getHours()}:${end.getMinutes()}`;
  }
  
  // 检查是否是同一年
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
  }
  
  // 不同年
  return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`;
}

/**
 * 获取日期的开始时间（00:00:00）
 * @param {Date} date - 日期对象
 * @returns {Date} 开始时间
 */
export function getStartOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取日期的结束时间（23:59:59）
 * @param {Date} date - 日期对象
 * @returns {Date} 结束时间
 */
export function getEndOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 获取指定月份的天数
 * @param {number} year - 年份
 * @param {number} month - 月份（1-12）
 * @returns {number} 天数
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * 计算两个日期之间的天数差
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {number} 天数差
 */
export function getDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 只比较日期部分，忽略时间
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}