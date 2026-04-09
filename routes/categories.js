const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 导入认证中间件
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 获取分类列表
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        order: 'asc',
        name: 'asc'
      }
    });

    // 格式化分类数据
    const formattedCategories = categories.map(category => ({
      ...category,
      postCount: category._count.posts
    }));

    res.json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取分类列表失败',
      error: error.message
    });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 格式化分类数据
    const formattedCategory = {
      ...category,
      postCount: category._count.posts
    };

    res.json({
      success: true,
      data: formattedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取分类详情失败',
      error: error.message
    });
  }
});

// 创建分类
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { name, slug, parentId, order } = req.body;

    // 验证输入
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '请提供分类名称'
      });
    }

    // 检查名称是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: '分类名称已存在'
      });
    }

    // 检查 slug 是否已存在
    if (slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug }
      });

      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: '分类 slug 已存在'
        });
      }
    }

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        parentId: parentId ? parseInt(parentId) : null,
        order: order || 0
      }
    });

    res.status(201).json({
      success: true,
      message: '创建成功',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建失败',
      error: error.message
    });
  }
});

// 更新分类
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, parentId, order } = req.body;

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 检查名称是否已存在（排除当前分类）
    if (name && name !== existingCategory.name) {
      const existingName = await prisma.category.findUnique({
        where: { name }
      });

      if (existingName) {
        return res.status(400).json({
          success: false,
          message: '分类名称已存在'
        });
      }
    }

    // 检查 slug 是否已存在（排除当前分类）
    if (slug && slug !== existingCategory.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug }
      });

      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: '分类 slug 已存在'
        });
      }
    }

    // 更新分类
    const category = await prisma.category.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: name || undefined,
        slug: slug || (name ? name.toLowerCase().replace(/\s+/g, '-') : undefined),
        parentId: parentId !== undefined ? parseInt(parentId) : null,
        order: order !== undefined ? order : undefined
      }
    });

    res.json({
      success: true,
      message: '更新成功',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message
    });
  }
});

// 删除分类
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        _count: {
          select: {
            posts: true,
            children: true
          }
        }
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 检查是否有文章或子分类
    if (existingCategory._count.posts > 0) {
      return res.status(400).json({
        success: false,
        message: '该分类下有文章，无法删除'
      });
    }

    if (existingCategory._count.children > 0) {
      return res.status(400).json({
        success: false,
        message: '该分类下有子分类，无法删除'
      });
    }

    // 删除分类
    await prisma.category.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除失败',
      error: error.message
    });
  }
});

module.exports = router;