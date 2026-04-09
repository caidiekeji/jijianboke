const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const prisma = new PrismaClient();

// 导入认证中间件
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 配置文件上传
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads'),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// 导出数据库
router.get('/export', auth, requireAdmin, async (req, res) => {
  try {
    // 获取所有数据
    const data = {
      users: await prisma.user.findMany(),
      categories: await prisma.category.findMany(),
      tags: await prisma.tag.findMany(),
      posts: await prisma.post.findMany({
        include: {
          tags: {
            select: {
              tagId: true
            }
          }
        }
      }),
      comments: await prisma.comment.findMany(),
      settings: await prisma.setting.findMany()
    };

    // 转换为 JSON 字符串
    const jsonData = JSON.stringify(data, null, 2);

    // 设置响应头
    res.setHeader('Content-Disposition', 'attachment; filename=database-export.json');
    res.setHeader('Content-Type', 'application/json');

    // 发送数据
    res.send(jsonData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '导出数据库失败',
      error: error.message
    });
  }
});

// 导入数据库
router.post('/import', auth, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择文件'
      });
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const data = JSON.parse(fileContent);

    // 开始事务
    await prisma.$transaction(async (tx) => {
      // 清空现有数据
      await tx.commentLike.deleteMany({});
      await tx.comment.deleteMany({});
      await tx.postTag.deleteMany({});
      await tx.post.deleteMany({});
      await tx.tag.deleteMany({});
      await tx.category.deleteMany({});
      await tx.user.deleteMany({});
      await tx.setting.deleteMany({});

      // 导入用户
      if (data.users) {
        for (const user of data.users) {
          await tx.user.create({
            data: user
          });
        }
      }

      // 导入分类
      if (data.categories) {
        for (const category of data.categories) {
          await tx.category.create({
            data: category
          });
        }
      }

      // 导入标签
      if (data.tags) {
        for (const tag of data.tags) {
          await tx.tag.create({
            data: tag
          });
        }
      }

      // 导入文章
      if (data.posts) {
        for (const post of data.posts) {
          const { tags, ...postData } = post;
          const createdPost = await tx.post.create({
            data: postData
          });

          // 导入文章标签关联
          if (tags && tags.length > 0) {
            for (const tag of tags) {
              await tx.postTag.create({
                data: {
                  postId: createdPost.id,
                  tagId: tag.tagId
                }
              });
            }
          }
        }
      }

      // 导入评论
      if (data.comments) {
        for (const comment of data.comments) {
          await tx.comment.create({
            data: comment
          });
        }
      }

      // 导入设置
      if (data.settings) {
        for (const setting of data.settings) {
          await tx.setting.create({
            data: setting
          });
        }
      }
    });

    // 删除临时文件
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: '导入数据库成功'
    });
  } catch (error) {
    // 删除临时文件
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: '导入数据库失败',
      error: error.message
    });
  }
});

// 备份数据库
router.get('/backup', auth, requireAdmin, async (req, res) => {
  try {
    // 复制数据库文件
    const dbPath = path.join(__dirname, '..', 'prisma', 'boke.db');
    const backupPath = path.join(__dirname, '..', `boke-${Date.now()}.db`);

    fs.copyFileSync(dbPath, backupPath);

    // 设置响应头
    res.setHeader('Content-Disposition', `attachment; filename=boke-${Date.now()}.db`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // 发送文件
    res.sendFile(backupPath, (err) => {
      // 删除临时备份文件
      fs.unlinkSync(backupPath);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '备份数据库失败',
      error: error.message
    });
  }
});

// 恢复数据库
router.post('/restore', auth, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择文件'
      });
    }

    // 停止数据库连接
    await prisma.$disconnect();

    // 复制数据库文件
    const dbPath = path.join(__dirname, '..', 'prisma', 'boke.db');
    fs.copyFileSync(req.file.path, dbPath);

    // 重新连接数据库
    await prisma.$connect();

    // 删除临时文件
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: '恢复数据库成功'
    });
  } catch (error) {
    // 删除临时文件
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: '恢复数据库失败',
      error: error.message
    });
  }
});

module.exports = router;