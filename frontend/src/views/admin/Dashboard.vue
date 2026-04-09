<template>
  <div class="dashboard-page">
    <h1>仪表盘</h1>
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>文章总数</h3>
          <p>{{ stats.posts }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>分类总数</h3>
          <p>{{ stats.categories }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>标签总数</h3>
          <p>{{ stats.tags }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>评论总数</h3>
          <p>{{ stats.comments }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>用户总数</h3>
          <p>{{ stats.users }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>访问量</h3>
          <p>{{ stats.pageViews }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-charts">
      <div class="chart-card">
        <h3>最近7天访问量</h3>
        <div class="chart-container">
          <!-- 这里可以添加图表组件 -->
          <div class="chart-placeholder">
            <p>图表将在这里显示</p>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h3>热门文章</h3>
        <div class="popular-posts">
          <div v-for="post in popularPosts" :key="post.id" class="popular-post-item">
            <div class="post-info">
              <h4>{{ post.title }}</h4>
              <p>{{ post.viewCount }} 阅读</p>
            </div>
            <router-link :to="`/admin/posts/${post.id}`" class="edit-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/api'

const stats = ref({
  posts: 0,
  categories: 0,
  tags: 0,
  comments: 0,
  users: 0,
  pageViews: 0
})

const popularPosts = ref([])

const loadStats = async () => {
  try {
    // 获取文章总数
    const postsResponse = await api.posts.getPosts({ pageSize: 1 })
    stats.value.posts = postsResponse.data.pagination.total

    // 获取分类总数
    const categoriesResponse = await api.categories.getCategories()
    stats.value.categories = categoriesResponse.data.length

    // 获取标签总数
    const tagsResponse = await api.tags.getTags()
    stats.value.tags = tagsResponse.data.length

    // 获取评论总数
    const commentsResponse = await api.comments.getComments({ status: 'all' })
    stats.value.comments = commentsResponse.data.length

    // 获取用户总数
    const usersResponse = await api.users.getUsers()
    stats.value.users = usersResponse.data.length

    // 获取访问量
    const statsResponse = await api.stats.getStats()
    stats.value.pageViews = statsResponse.data.overview.totalPageViews

    // 获取热门文章
    const popularResponse = await api.posts.getPopularPosts({ limit: 5 })
    popularPosts.value = popularResponse.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(async () => {
  await loadStats()
})
</script>

<style scoped>
.dashboard-page {
  padding: 2rem;
}

.dashboard-page h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a73e8;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-content p {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.chart-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.chart-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.chart-placeholder {
  text-align: center;
  color: #64748b;
}

.popular-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.popular-post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.popular-post-item:hover {
  background: #f1f5f9;
}

.post-info h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-info p {
  font-size: 0.75rem;
  color: #64748b;
}

.edit-btn {
  width: 32px;
  height: 32px;
  background: #1a73e8;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #1557b0;
  transform: scale(1.1);
}

.edit-btn svg {
  width: 16px;
  height: 16px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 1.5rem;
  }
  
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .stat-content p {
    font-size: 1.25rem;
  }
  
  .chart-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .dashboard-page h1 {
    font-size: 1.75rem;
  }
}
</style>