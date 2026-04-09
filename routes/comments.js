const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 导入认证中间件
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 获取评论列表
router.get('/', async (req, res) => {
  try {
    const { postId, status = 'approved' } = req.query;

    const where = {
      postId: postId ? parseInt(postId) : undefined,
      status: status !== 'all' ? status : undefined
    };

    const comments = await prisma.comment.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        post: {
          select: {
            id: true,
            title: true
          }
        },
        parent: {
          select: {
            id: true,
            content: true
          }
        },
        children: {
          where: {
            status: 'approved'
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取评论列表失败',
      error: error.message
    });
  }
});

// 创建评论
router.post('/', async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;

    // 验证输入
    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: '请提供文章 ID 和评论内容'
      });
    }

    // 检查文章是否存在
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId)
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 检查父评论是否存在
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: {
          id: parseInt(parentId)
        }
      });

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: '父评论不存在'
        });
      }
    }

    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        parentId: parentId ? parseInt(parentId) : null,
        authorId: req.user?.id || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        post: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: '评论成功',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '评论失败',
      error: error.message
    });
  }
});

// 更新评论状态（管理员）
router.put('/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 验证输入
    if (!status || !['approved', 'pending', 'spam', 'deleted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的状态'
      });
    }

    // 检查评论是否存在
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    // 更新评论状态
    const comment = await prisma.comment.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        post: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: '更新成功',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message
    });
  }
});

// 删除评论
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查评论是否存在
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    // 检查权限（只有作者、文章作者或管理员可以删除）
    if (existingComment.authorId !== req.user.id && req.user.role !== 'admin') {
      // 检查是否是文章作者
      const post = await prisma.post.findUnique({
        where: {
          id: existingComment.postId
        }
      });

      if (post.authorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: '没有权限删除这条评论'
        });
      }
    }

    // 删除评论
    await prisma.comment.delete({
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

// 点赞评论
router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查评论是否存在
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    // 检查是否已经点赞
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: req.user.id,
          commentId: parseInt(id)
        }
      }
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: '已经点赞过了'
      });
    }

    // 创建点赞
    await prisma.commentLike.create({
      data: {
        userId: req.user.id,
        commentId: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: '点赞成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '点赞失败',
      error: error.message
    });
  }
});

// 取消点赞评论
router.delete('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查是否已经点赞
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: req.user.id,
          commentId: parseInt(id)
        }
      }
    });

    if (!existingLike) {
      return res.status(400).json({
        success: false,
        message: '还没有点赞'
      });
    }

    // 删除点赞
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: req.user.id,
          commentId: parseInt(id)
        }
      }
    });

    res.json({
      success: true,
      message: '取消点赞成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '取消点赞失败',
      error: error.message
    });
  }
});

module.exports = router;