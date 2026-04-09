<template>
  <div class="search-page">
    <div class="container">
      <h1>搜索结果</h1>
      <div class="search-query">
        <p>搜索关键词: <strong>{{ searchQuery }}</strong></p>
      </div>
      <div class="posts-grid">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-card-image">
            <img :src="post.cover" :alt="post.title" />
          </div>
          <div class="post-card-content">
            <div class="post-meta">
              <span class="post-category" v-if="post.category">
                <router-link :to="`/categories/${post.category.id}`">{{ post.category.name }}</router-link>
              </span>
              <span class="post-date">{{ formatDate(post.createdAt, 'date') }}</span>
            </div>
            <h3 class="post-title">
              <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
            </h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-footer">
              <div class="post-author">
                <img :src="post.author.avatar || 'https://ui-avatars.com/api/?name=' + post.author.name + '&background=random'" :alt="post.author.name" class="author-avatar" />
                <span class="author-name">{{ post.author.name }}</span>
              </div>
              <div class="post-stats">
                <span class="post-views">{{ post.viewCount }} 阅读</span>
                <span class="post-comments">{{ post.commentCount }} 评论</span>
              </div>
            </div>
          </div>
        </div>
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

      <!-- 无结果提示 -->
      <div class="no-results" v-if="posts.length === 0">
        <p>没有找到与 "{{ searchQuery }}" 相关的文章</p>
        <router-link to="/" class="btn-primary">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '../utils/date'
import api from '../utils/api'

const route = useRoute()

const posts = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const searchQuery = computed(() => route.query.q || '')

const loadPosts = async (page = 1) => {
  try {
    const response = await api.posts.getPosts({
      page,
      pageSize: 10,
      search: searchQuery.value,
      status: 'published'
    })
    posts.value = response.data.posts
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('搜索文章失败:', error)
  }
}

onMounted(async () => {
  // 记录访问日志
  await api.stats.trackVisit({ path: `/search?q=${searchQuery.value}` })
  // 加载搜索结果
  await loadPosts()
})
</script>

<style scoped>
.search-page {
  padding: 4rem 0;
}

.search-page h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e293b;
  text-align: center;
}

.search-query {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.125rem;
  color: #64748b;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.post-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-card:hover .post-card-image img {
  transform: scale(1.05);
}

.post-card-content {
  padding: 1.5rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.post-category a {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.post-category a:hover {
  color: #1557b0;
  text-decoration: underline;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.post-title a {
  color: #1e293b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-title a:hover {
  color: #1a73e8;
}

.post-excerpt {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.post-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.post-views,
.post-comments {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
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

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 4rem 0;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 2rem;
}

.no-results p {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
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
  text-decoration: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-page {
    padding: 2rem 0;
  }
  
  .search-page h1 {
    font-size: 2rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .search-page h1 {
    font-size: 1.75rem;
  }
  
  .post-card-content {
    padding: 1.25rem;
  }
  
  .no-results {
    padding: 2rem 0;
  }
}
</style>