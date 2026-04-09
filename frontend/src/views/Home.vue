<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1>{{ siteTitle }}</h1>
        <p>{{ siteDescription }}</p>
        <div class="hero-buttons">
          <router-link to="/posts" class="btn-primary">查看文章</router-link>
          <router-link to="/about" class="btn-secondary">了解更多</router-link>
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="posts-section">
      <div class="container">
        <div class="section-header">
          <h2>最新文章</h2>
          <router-link to="/posts" class="view-all">查看全部</router-link>
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
                <span class="post-date">{{ formatDate(post.createdAt) }}</span>
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
      </div>
    </section>

    <!-- 分类和标签 -->
    <section class="sidebar-section">
      <div class="container">
        <div class="sidebar-grid">
          <!-- 分类 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">分类</h3>
            <ul class="category-list">
              <li v-for="category in categories" :key="category.id">
                <router-link :to="`/categories/${category.id}`">
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-count">{{ category.postCount }}</span>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- 标签 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">标签</h3>
            <div class="tag-cloud">
              <router-link v-for="tag in tags" :key="tag.id" :to="`/tags/${tag.id}" class="tag">
                {{ tag.name }}
                <span class="tag-count">({{ tag.postCount }})</span>
              </router-link>
            </div>
          </div>

          <!-- 热门文章 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">热门文章</h3>
            <ul class="popular-posts">
              <li v-for="post in popularPosts" :key="post.id">
                <router-link :to="`/posts/${post.id}">
                  <div class="popular-post-image">
                    <img :src="post.cover" :alt="post.title" />
                  </div>
                  <div class="popular-post-content">
                    <h4 class="popular-post-title">{{ post.title }}</h4>
                    <span class="popular-post-date">{{ formatDate(post.createdAt) }}</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '../utils/date'
import api from '../utils/api'

const router = useRouter()

const posts = ref([])
const categories = ref([])
const tags = ref([])
const popularPosts = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const siteTitle = computed(() => '我的博客')
const siteDescription = computed(() => '分享技术、记录生活、探索未知')

const loadPosts = async (page = 1) => {
  try {
    const response = await api.posts.getPosts({
      page,
      pageSize: 10,
      status: 'published'
    })
    posts.value = response.data.posts
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

const loadCategories = async () => {
  try {
    const response = await api.categories.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

const loadTags = async () => {
  try {
    const response = await api.tags.getTags()
    tags.value = response.data
  } catch (error) {
    console.error('获取标签列表失败:', error)
  }
}

const loadPopularPosts = async () => {
  try {
    const response = await api.posts.getPopularPosts()
    popularPosts.value = response.data
  } catch (error) {
    console.error('获取热门文章失败:', error)
  }
}

onMounted(async () => {
  // 记录访问日志
  await api.stats.trackVisit({ path: '/' })

  // 并行加载数据，提高页面加载速度
  await Promise.all([
    loadPosts(),
    loadCategories(),
    loadTags(),
    loadPopularPosts()
  ])
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* 英雄区域 */
.hero {
  background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
  color: white;
  padding: 8rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmMTAiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4yIj48L3BhdGg+Cjwvc3ZnPg==');
  opacity: 0.1;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: white;
  color: #1a73e8;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  text-decoration: none;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  text-decoration: none;
}

/* 文章列表 */
.posts-section {
  padding: 6rem 0;
  background: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.view-all {
  color: #1a73e8;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: #1557b0;
  text-decoration: underline;
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

/* 侧边栏 */
.sidebar-section {
  padding: 6rem 0;
  background: #f8fafc;
}

.sidebar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.sidebar-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.category-list {
  list-style: none;
}

.category-list li {
  margin-bottom: 1rem;
}

.category-list a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.category-list a:hover {
  color: #1a73e8;
}

.category-count {
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #e2e8f0;
  color: #1a73e8;
}

.tag-count {
  font-size: 0.75rem;
  opacity: 0.7;
}

.popular-posts {
  list-style: none;
}

.popular-posts li {
  margin-bottom: 1.5rem;
}

.popular-posts a {
  display: flex;
  gap: 1rem;
  text-decoration: none;
  color: #1e293b;
  transition: all 0.2s ease;
}

.popular-posts a:hover {
  color: #1a73e8;
}

.popular-post-image {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.popular-post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popular-post-content {
  flex: 1;
}

.popular-post-title {
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-post-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    padding: 6rem 0;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 200px;
    text-align: center;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .post-card-content {
    padding: 1.25rem;
  }

  .sidebar-card {
    padding: 1.5rem;
  }
}
</style>