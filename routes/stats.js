const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 导入认证中间件
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 记录访问
router.post('/track', async (req, res) => {
  try {
    const { path, referrer, userAgent, ip } = req.body;

    // 获取真实 IP
    const clientIp = ip || req.ip || req.connection.remoteAddress;

    // 记录访问日志
    await prisma.visitLog.create({
      data: {
        ip: clientIp,
        userAgent: userAgent || req.headers['user-agent'],
        path: path || req.path,
        referrer: referrer || req.headers.referer,
        userId: req.user?.id
      }
    });

    // 更新每日统计
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyStats = await prisma.dailyStats.findUnique({
      where: {
        date: today
      }
    });

    if (dailyStats) {
      // 更新现有统计
      await prisma.dailyStats.update({
        where: {
          date: today
        },
        data: {
          pageViews: {
            increment: 1
          }
        }
      });
    } else {
      // 创建新统计
      await prisma.dailyStats.create({
        data: {
          date: today,
          pageViews: 1,
          uniqueVisitors: 1
        }
      });
    }

    res.json({
      success: true,
      message: '访问记录成功'
    });
  } catch (error) {
    console.error('记录访问失败:', error);
    // 记录访问失败不影响用户体验，返回成功
    res.json({
      success: true,
      message: '访问记录成功'
    });
  }
});

// 获取统计数据
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};

    if (startDate) {
      where.date = {
        ...where.date,
        gte: new Date(startDate)
      };
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.date = {
        ...where.date,
        lte: end
      };
    }

    const stats = await prisma.dailyStats.findMany({
      where,
      orderBy: {
        date: 'asc'
      }
    });

    // 计算总览数据
    const overview = {
      totalPageViews: stats.reduce((sum, stat) => sum + stat.pageViews, 0),
      totalUniqueVisitors: stats.reduce((sum, stat) => sum + stat.uniqueVisitors, 0),
      averagePageViewsPerDay: stats.length > 0 ? Math.round(stats.reduce((sum, stat) => sum + stat.pageViews, 0) / stats.length) : 0,
      averageUniqueVisitorsPerDay: stats.length > 0 ? Math.round(stats.reduce((sum, stat) => sum + stat.uniqueVisitors, 0) / stats.length) : 0
    };

    res.json({
      success: true,
      data: {
        overview,
        dailyStats: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计数据失败',
      error: error.message
    });
  }
});

// 获取热门页面
router.get('/top-pages', auth, requireAdmin, async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    const where = {};

    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate)
      };
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt = {
        ...where.createdAt,
        lte: end
      };
    }

    const topPages = await prisma.visitLog.groupBy({
      by: ['path'],
      where,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: parseInt(limit)
    });

    res.json({
      success: true,
      data: topPages.map(page => ({
        path: page.path,
        count: page._count.id
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取热门页面失败',
      error: error.message
    });
  }
});

// 获取流量来源
router.get('/sources', auth, requireAdmin, async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    const where = {};

    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate)
      };
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt = {
        ...where.createdAt,
        lte: end
      };
    }

    const sources = await prisma.visitLog.groupBy({
      by: ['referrer'],
      where,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: parseInt(limit)
    });

    res.json({
      success: true,
      data: sources.map(source => ({
        referrer: source.referrer || '直接访问',
        count: source._count.id
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取流量来源失败',
      error: error.message
    });
  }
});

module.exports = router;