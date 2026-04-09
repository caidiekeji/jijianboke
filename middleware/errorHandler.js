// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 开发环境错误
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // 生产环境错误
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // 处理 Prisma 错误
    if (err.name === 'PrismaClientKnownRequestError') {
      if (err.code === 'P2002') {
        error.message = '数据已存在';
      } else if (err.code === 'P2025') {
        error.message = '数据不存在';
      } else {
        error.message = '数据库操作失败';
      }
    }

    // 处理 JWT 错误
    if (err.name === 'JsonWebTokenError') {
      error.message = '无效的令牌';
      error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
      error.message = '令牌已过期';
      error.statusCode = 401;
    }

    // 处理验证错误
    if (err.name === 'ValidationError') {
      error.message = Object.values(err.errors).map(el => el.message).join(', ');
      error.statusCode = 400;
    }

    // 处理类型错误
    if (err.name === 'TypeError') {
      error.message = '类型错误';
      error.statusCode = 400;
    }

    // 处理 404 错误
    if (error.statusCode === 404) {
      error.message = '请求的资源不存在';
    }

    // 处理 500 错误
    if (error.statusCode === 500) {
      error.message = '服务器内部错误';
    }

    return res.status(error.statusCode).json({
      success: false,
      message: error.message || '服务器内部错误'
    });
  }

  // 默认错误处理
  res.status(err.statusCode).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
};

module.exports = errorHandler;
module.exports.AppError = AppError;