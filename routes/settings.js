const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 导入认证中间件
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 获取所有设置
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取设置失败',
      error: error.message
    });
  }
});

// 获取单个设置
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const setting = await prisma.setting.findUnique({
      where: { id }
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: '设置不存在'
      });
    }

    res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取设置失败',
      error: error.message
    });
  }
});

// 更新设置
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    // 检查设置是否存在
    const existingSetting = await prisma.setting.findUnique({
      where: { id }
    });

    if (existingSetting) {
      // 更新现有设置
      const setting = await prisma.setting.update({
        where: { id },
        data: { value }
      });

      res.json({
        success: true,
        message: '更新成功',
        data: setting
      });
    } else {
      // 创建新设置
      const setting = await prisma.setting.create({
        data: {
          id,
          value
        }
      });

      res.status(201).json({
        success: true,
        message: '创建成功',
        data: setting
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新设置失败',
      error: error.message
    });
  }
});

// 创建设置
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { id, value } = req.body;

    // 检查设置是否已存在
    const existingSetting = await prisma.setting.findUnique({
      where: { id }
    });

    if (existingSetting) {
      return res.status(400).json({
        success: false,
        message: '设置已存在'
      });
    }

    // 创建新设置
    const setting = await prisma.setting.create({
      data: {
        id,
        value
      }
    });

    res.status(201).json({
      success: true,
      message: '创建成功',
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建设置失败',
      error: error.message
    });
  }
});

// 删除设置
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查设置是否存在
    const existingSetting = await prisma.setting.findUnique({
      where: { id }
    });

    if (!existingSetting) {
      return res.status(404).json({
        success: false,
        message: '设置不存在'
      });
    }

    // 删除设置
    await prisma.setting.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除设置失败',
      error: error.message
    });
  }
});

module.exports = router;