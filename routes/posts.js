const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 导入认证中间件
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 获取文章列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, categoryId, tagId, search, status = 'published' } = req.query;

    const where = {
      status: status !== 'all' ? status : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      tags: tagId ? {
        some: {
          tagId: parseInt(tagId)
        }
      } : undefined,
      OR: search ? [
        {
          title: {
            contains: search
          }
        },
        {
          content: {
            contains: search
          }
        },
        {
          excerpt: {
            contains: search
          }
        }
      ] : undefined
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          tags: {
            select: {
              tag: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          _count: {
            select: {
              comments: {
                where: {
                  status: 'approved'
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize)
      }),
      prisma.post.count({
        where
      })
    ]);

    // 格式化文章数据
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(tag => tag.tag),
      commentCount: post._count.comments
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / parseInt(pageSize))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取文章列表失败',
      error: error.message
    });
  }
});

// 获取文章详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            tag: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        comments: {
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
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 增加浏览量
    await prisma.post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        viewCount: { increment: 1 }
      }
    });

    // 格式化文章数据
    const formattedPost = {
      ...post,
      tags: post.tags.map(tag => tag.tag),
      commentCount: post.comments.length
    };

    res.json({
      success: true,
      data: formattedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取文章详情失败',
      error: error.message
    });
  }
});

// 创建文章
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, cover, status, categoryId, tagIds } = req.body;

    // 验证输入
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '请提供标题和内容'
      });
    }

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150),
        cover,
        status: status || 'draft',
        authorId: req.user.id,
        categoryId: categoryId ? parseInt(categoryId) : null,
        tags: tagIds ? {
          create: tagIds.map(tagId => ({
            tag: {
              connect: { id: parseInt(tagId) }
            }
          }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            tag: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    });

    // 格式化文章数据
    const formattedPost = {
      ...post,
      tags: post.tags.map(tag => tag.tag)
    };

    res.status(201).json({
      success: true,
      message: '创建成功',
      data: formattedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建失败',
      error: error.message
    });
  }
});

// 更新文章
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, cover, status, categoryId, tagIds } = req.body;

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 检查权限（只有作者或管理员可以更新）
    if (existingPost.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限更新这篇文章'
      });
    }

    // 更新文章
    const post = await prisma.post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: title || undefined,
        content: content || undefined,
        excerpt: excerpt || undefined,
        cover: cover || undefined,
        status: status || undefined,
        categoryId: categoryId ? parseInt(categoryId) : null,
        tags: tagIds ? {
          deleteMany: {},
          create: tagIds.map(tagId => ({
            tag: {
              connect: { id: parseInt(tagId) }
            }
          }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            tag: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    });

    // 格式化文章数据
    const formattedPost = {
      ...post,
      tags: post.tags.map(tag => tag.tag)
    };

    res.json({
      success: true,
      message: '更新成功',
      data: formattedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message
    });
  }
});

// 删除文章
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 检查权限（只有作者或管理员可以删除）
    if (existingPost.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限删除这篇文章'
      });
    }

    // 删除文章
    await prisma.post.delete({
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

// 获取热门文章
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        status: 'published'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            comments: {
              where: {
                status: 'approved'
              }
            }
          }
        }
      },
      orderBy: {
        viewCount: 'desc'
      },
      take: parseInt(limit)
    });

    // 格式化文章数据
    const formattedPosts = posts.map(post => ({
      ...post,
      commentCount: post._count.comments
    }));

    res.json({
      success: true,
      data: formattedPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取热门文章失败',
      error: error.message
    });
  }
});

// 获取相关文章
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    // 获取当前文章
    const currentPost = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        tags: {
          select: {
            tagId: true
          }
        }
      }
    });

    if (!currentPost) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 获取相关文章
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: {
          not: parseInt(id)
        },
        status: 'published',
        OR: [
          {
            categoryId: currentPost.categoryId
          },
          {
            tags: {
              some: {
                tagId: {
                  in: currentPost.tags.map(tag => tag.tagId)
                }
              }
            }
          }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            comments: {
              where: {
                status: 'approved'
              }
            }
          }
        }
      },
      orderBy: {
        viewCount: 'desc'
      },
      take: parseInt(limit)
    });

    // 格式化文章数据
    const formattedPosts = relatedPosts.map(post => ({
      ...post,
      commentCount: post._count.comments
    }));

    res.json({
      success: true,
      data: formattedPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取相关文章失败',
      error: error.message
    });
  }
});

module.exports = router;