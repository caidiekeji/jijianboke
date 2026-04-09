import { describe, it, expect } from 'vitest'
import { formatDate, getRelativeTime, isToday, isYesterday, isThisWeek, isThisMonth, formatDateRange, getStartOfDay, getEndOfDay, getDaysInMonth, getDaysDifference } from './date'

describe('date.js', () => {
  describe('formatDate', () => {
    it('should format date with full format', () => {
      const date = new Date('2023-01-01 12:00:00')
      const result = formatDate(date, 'full')
      expect(result).toBe('2023/01/01 12:00:00')
    })

    it('should format date with date format', () => {
      const date = new Date('2023-01-01 12:00:00')
      const result = formatDate(date, 'date')
      expect(result).toBe('2023/01/01')
    })

    it('should format date with time format', () => {
      const date = new Date('2023-01-01 12:00:00')
      const result = formatDate(date, 'time')
      expect(result).toBe('12:00')
    })

    it('should format date with relative format', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      const result = formatDate(date, 'relative')
      expect(result).toBe('5分钟前')
    })

    it('should return invalid date for invalid date', () => {
      const result = formatDate('invalid date')
      expect(result).toBe('无效日期')
    })
  })

  describe('getRelativeTime', () => {
    it('should return "刚刚" for less than 1 minute', () => {
      const date = new Date(Date.now() - 30 * 1000) // 30 seconds ago
      const result = getRelativeTime(date)
      expect(result).toBe('刚刚')
    })

    it('should return minutes ago for less than 1 hour', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      const result = getRelativeTime(date)
      expect(result).toBe('5分钟前')
    })

    it('should return hours ago for less than 1 day', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      const result = getRelativeTime(date)
      expect(result).toBe('2小时前')
    })

    it('should return days ago for less than 1 week', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      const result = getRelativeTime(date)
      expect(result).toBe('3天前')
    })

    it('should return weeks ago for less than 1 month', () => {
      const date = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000) // 2 weeks ago
      const result = getRelativeTime(date)
      expect(result).toBe('2周前')
    })

    it('should return months ago for less than 1 year', () => {
      const date = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000) // 3 months ago
      const result = getRelativeTime(date)
      expect(result).toBe('3个月前')
    })

    it('should return years ago for more than 1 year', () => {
      const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000) // 2 years ago
      const result = getRelativeTime(date)
      expect(result).toBe('2年前')
    })
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const date = new Date()
      const result = isToday(date)
      expect(result).toBe(true)
    })

    it('should return false for yesterday', () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      const result = isToday(date)
      expect(result).toBe(false)
    })
  })

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      const result = isYesterday(date)
      expect(result).toBe(true)
    })

    it('should return false for today', () => {
      const date = new Date()
      const result = isYesterday(date)
      expect(result).toBe(false)
    })
  })

  describe('isThisWeek', () => {
    it('should return true for this week', () => {
      const date = new Date()
      const result = isThisWeek(date)
      expect(result).toBe(true)
    })

    it('should return false for last week', () => {
      const date = new Date()
      date.setDate(date.getDate() - 8) // 8 days ago
      const result = isThisWeek(date)
      expect(result).toBe(false)
    })
  })

  describe('isThisMonth', () => {
    it('should return true for this month', () => {
      const date = new Date()
      const result = isThisMonth(date)
      expect(result).toBe(true)
    })

    it('should return false for last month', () => {
      const date = new Date()
      date.setMonth(date.getMonth() - 1)
      const result = isThisMonth(date)
      expect(result).toBe(false)
    })
  })

  describe('formatDateRange', () => {
    it('should format same day range', () => {
      const startDate = new Date('2023-01-01 10:00:00')
      const endDate = new Date('2023-01-01 12:00:00')
      const result = formatDateRange(startDate, endDate)
      expect(result).toBe('2023/01/01 10:00:00')
    })

    it('should format same month range', () => {
      const startDate = new Date('2023-01-01 10:00:00')
      const endDate = new Date('2023-01-02 12:00:00')
      const result = formatDateRange(startDate, endDate)
      expect(result).toBe('1月1日 10:00 - 2日 12:00')
    })

    it('should format same year range', () => {
      const startDate = new Date('2023-01-01')
      const endDate = new Date('2023-02-01')
      const result = formatDateRange(startDate, endDate)
      expect(result).toBe('2023年1月1日 - 2月1日')
    })

    it('should format different year range', () => {
      const startDate = new Date('2023-01-01')
      const endDate = new Date('2024-01-01')
      const result = formatDateRange(startDate, endDate)
      expect(result).toBe('2023年1月1日 - 2024年1月1日')
    })

    it('should return invalid date range for invalid dates', () => {
      const result = formatDateRange('invalid', 'invalid')
      expect(result).toBe('无效日期范围')
    })
  })

  describe('getStartOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2023-01-01 12:34:56')
      const result = getStartOfDay(date)
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
      expect(result.getMilliseconds()).toBe(0)
    })
  })

  describe('getEndOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2023-01-01 12:34:56')
      const result = getEndOfDay(date)
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
      expect(result.getSeconds()).toBe(59)
      expect(result.getMilliseconds()).toBe(999)
    })
  })

  describe('getDaysInMonth', () => {
    it('should return correct days in month', () => {
      expect(getDaysInMonth(2023, 2)).toBe(28) // February 2023
      expect(getDaysInMonth(2024, 2)).toBe(29) // February 2024 (leap year)
      expect(getDaysInMonth(2023, 4)).toBe(30) // April 2023
      expect(getDaysInMonth(2023, 5)).toBe(31) // May 2023
    })
  })

  describe('getDaysDifference', () => {
    it('should return correct days difference', () => {
      const startDate = new Date('2023-01-01')
      const endDate = new Date('2023-01-05')
      const result = getDaysDifference(startDate, endDate)
      expect(result).toBe(4)
    })

    it('should return 0 for same day', () => {
      const startDate = new Date('2023-01-01')
      const endDate = new Date('2023-01-01')
      const result = getDaysDifference(startDate, endDate)
      expect(result).toBe(0)
    })
  })
});