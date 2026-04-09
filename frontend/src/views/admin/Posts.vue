<template>
  <div class="posts-page">
    <div class="page-header">
      <h1>文章管理</h1>
      <router-link to="/admin/posts/create" class="btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新建文章
      </router-link>
    </div>
    <div class="filter-bar">
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="搜索文章..." class="search-input" />
        <button @click="loadPosts" class="search-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
      <div class="filter-select">
        <select v-model="statusFilter" @change="loadPosts" class="select-input">
          <option value="all">所有状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
      </div>
    </div>
    <div class="posts-table">
      <table>
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>作者</th>
            <th>状态</th>
            <th>发布时间</th>
            <th>阅读量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td class="post-title">{{ post.title }}</td>
            <td>{{ post.category?.name || '未分类' }}</td>
            <td>{{ post.author.name }}</td>
            <td>
              <span class="status-badge" :class="post.status">{{ post.status === 'published' ? '已发布' : '草稿' }}</span>
            </td>
            <td>{{ formatDate(post.createdAt, 'full') }}</td>
            <td>{{ post.viewCount }}</td>
            <td class="action-buttons">
              <router-link :to="`/posts/${post.id}`" class="view-btn" target="_blank">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </router-link>
              <router-link :to="`/admin/posts/${post.id}`" class="edit-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </router-link>
              <button @click="deletePost(post.id)" class="delete-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页 -->
    <div class="pagination" v-if="pagination.totalPages > 1">
      <button class="page-btn" :disabled="pagination.page === 1" @click="loadPosts(pagination.page - 1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="page-info">{{ pagination.page }} / {{ pagination.totalPages }}</span>
      <button class="page-btn" :disabled="pagination.page === pagination.totalPages" @click="loadPosts(pagination.page + 1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '../../utils/date'
import api from '../../utils/api'

const router = useRouter()

const posts = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const searchQuery = ref('')
const statusFilter = ref('all')

const loadPosts = async (page = 1) => {
  try {
    const params = {
      page,
      pageSize: 10,
      status: statusFilter.value === 'all' ? undefined : statusFilter.value
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    const response = await api.posts.getPosts(params)
    posts.value = response.data.posts
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

const deletePost = async (id) => {
  if (confirm('确定要删除这篇文章吗？')) {
    try {
      await api.posts.deletePost(id)
      // 重新加载文章列表
      await loadPosts()
    } catch (error) {
      console.error('删除文章失败:', error)
    }
  }
}

onMounted(async () => {
  await loadPosts()
})
</script>

<style scoped>
.posts-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1557b0;
  transform: translateY(-2px);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.search-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #f1f5f9;
  color: #1a73e8;
}

.search-button svg {
  width: 16px;
  height: 16px;
}

.filter-select {
  flex-shrink: 0;
}

.select-input {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.posts-table {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.posts-table table {
  width: 100%;
  border-collapse: collapse;
}

.posts-table th,
.posts-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.posts-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.posts-table tr:hover {
  background: #f8fafc;
}

.post-title {
  font-weight: 500;
  color: #1e293b;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.published {
  background: #e6f4ea;
  color: #188038;
}

.status-badge.draft {
  background: #fff3cd;
  color: #f29900;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.view-btn,
.edit-btn,
.delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.view-btn {
  background: #e3f2fd;
  color: #1a73e8;
}

.edit-btn {
  background: #fff3cd;
  color: #f29900;
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.view-btn:hover {
  background: #bbdefb;
}

.edit-btn:hover {
  background: #ffecb3;
}

.delete-btn:hover {
  background: #ffcdd2;
}

.view-btn svg,
.edit-btn svg,
.delete-btn svg {
  width: 16px;
  height: 16px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .posts-table {
    overflow-x: auto;
  }
  
  .posts-table table {
    min-width: 800px;
  }
}

@media (max-width: 768px) {
  .posts-page {
    padding: 1.5rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filter-bar {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .btn-primary {
    width: fit-content;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .btn-primary {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .search-input,
  .select-input {
    padding: 0.625rem;
    font-size: 0.875rem;
  }
  
  .posts-table th,
  .posts-table td {
    padding: 0.75rem;
  }
}
</style>