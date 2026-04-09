// API 工具函数
const API_BASE_URL = 'http://localhost:3000/api';

// 基础请求函数
async function request(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API 请求失败');
    }

    return data;
  } catch (error) {
    console.error('API 请求错误:', error);
    throw error;
  }
}

// API 模块
const api = {
  // 用户相关
  users: {
    register: (data) => request('/users/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    login: (data) => request('/users/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getCurrentUser: () => request('/users/me'),
    updateProfile: (data) => request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    changePassword: (data) => request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    getUsers: () => request('/users'),
    getUser: (id) => request(`/users/${id}`),
    updateUser: (id, data) => request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteUser: (id) => request(`/users/${id}`, {
      method: 'DELETE'
    })
  },

  // 文章相关
  posts: {
    getPosts: (params) => {
      const queryParams = new URLSearchParams(params).toString();
      return request(`/posts?${queryParams}`);
    },
    getPost: (id) => request(`/posts/${id}`),
    createPost: (data) => request('/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updatePost: (id, data) => request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deletePost: (id) => request(`/posts/${id}`, {
      method: 'DELETE'
    }),
    getPopularPosts: (params) => {
      const queryParams = new URLSearchParams(params).toString();
      return request(`/posts/popular?${queryParams}`);
    },
    getRelatedPosts: (id, params) => {
      const queryParams = new URLSearchParams(params).toString();
      return request(`/posts/${id}/related?${queryParams}`);
    }
  },

  // 分类相关
  categories: {
    getCategories: () => request('/categories'),
    getCategory: (id) => request(`/categories/${id}`),
    createCategory: (data) => request('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateCategory: (id, data) => request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteCategory: (id) => request(`/categories/${id}`, {
      method: 'DELETE'
    })
  },

  // 标签相关
  tags: {
    getTags: () => request('/tags'),
    getTag: (id) => request(`/tags/${id}`),
    createTag: (data) => request('/tags', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateTag: (id, data) => request(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteTag: (id) => request(`/tags/${id}`, {
      method: 'DELETE'
    })
  },

  // 评论相关
  comments: {
    getComments: (params) => {
      const queryParams = new URLSearchParams(params).toString();
      return request(`/comments?${queryParams}`);
    },
    createComment: (data) => request('/comments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateCommentStatus: (id, data) => request(`/comments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteComment: (id) => request(`/comments/${id}`, {
      method: 'DELETE'
    }),
    likeComment: (id) => request(`/comments/${id}/like`, {
      method: 'POST'
    }),
    unlikeComment: (id) => request(`/comments/${id}/like`, {
      method: 'DELETE'
    })
  },

  // 设置相关
  settings: {
    getSettings: () => request('/settings'),
    updateSetting: (id, data) => request(`/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // 统计相关
  stats: {
    trackVisit: (data) => request('/stats/track', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getStats: (params) => {
      const queryParams = new URLSearchParams(params).toString();
      return request(`/stats?${queryParams}`);
    },
    getTopPages: (params) => {
      const queryParams = new URLSearchParams(params).toString();
      return request(`/stats/top-pages?${queryParams}`);
    },
    getTrafficSources: (params) => {
      const queryParams = new URLSearchParams(params).toString();
      return request(`/stats/sources?${queryParams}`);
    }
  },

  // 数据库相关
  db: {
    exportDb: () => request('/db/export'),
    importDb: (data) => request('/db/import', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    backupDb: () => request('/db/backup'),
    restoreDb: (data) => request('/db/restore', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
};

export default api;