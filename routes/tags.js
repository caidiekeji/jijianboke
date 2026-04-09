const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 导入认证中间件
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 获取标签列表
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // 格式化标签数据
    const formattedTags = tags.map(tag => ({
      ...tag,
      postCount: tag._count.posts
    }));

    res.json({
      success: true,
      data: formattedTags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取标签列表失败',
      error: error.message
    });
  }
});

// 获取单个标签
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
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

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: '标签不存在'
      });
    }

    // 格式化标签数据
    const formattedTag = {
      ...tag,
      postCount: tag._count.posts
    };

    res.json({
      success: true,
      data: formattedTag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取标签详情失败',
      error: error.message
    });
  }
});

// 创建标签
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body;

    // 验证输入
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '请提供标签名称'
      });
    }

    // 检查名称是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: { name }
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: '标签名称已存在'
      });
    }

    // 检查 slug 是否已存在
    if (slug) {
      const existingSlug = await prisma.tag.findUnique({
        where: { slug }
      });

      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: '标签 slug 已存在'
        });
      }
    }

    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-')
      }
    });

    res.status(201).json({
      success: true,
      message: '创建成功',
      data: tag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建失败',
      error: error.message
    });
  }
});

// 更新标签
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        message: '标签不存在'
      });
    }

    // 检查名称是否已存在（排除当前标签）
    if (name && name !== existingTag.name) {
      const existingName = await prisma.tag.findUnique({
        where: { name }
      });

      if (existingName) {
        return res.status(400).json({
          success: false,
          message: '标签名称已存在'
        });
      }
    }

    // 检查 slug 是否已存在（排除当前标签）
    if (slug && slug !== existingTag.slug) {
      const existingSlug = await prisma.tag.findUnique({
        where: { slug }
      });

      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: '标签 slug 已存在'
        });
      }
    }

    // 更新标签
    const tag = await prisma.tag.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: name || undefined,
        slug: slug || (name ? name.toLowerCase().replace(/\s+/g, '-') : undefined)
      }
    });

    res.json({
      success: true,
      message: '更新成功',
      data: tag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message
    });
  }
});

// 删除标签
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
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

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        message: '标签不存在'
      });
    }

    // 检查是否有文章
    if (existingTag._count.posts > 0) {
      return res.status(400).json({
        success: false,
        message: '该标签下有文章，无法删除'
      });
    }

    // 删除标签
    await prisma.tag.delete({
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