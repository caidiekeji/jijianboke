<template>
  <div class="categories-page">
    <div class="container">
      <h1>分类</h1>
      <div class="categories-grid">
        <div v-for="category in categories" :key="category.id" class="category-card">
          <router-link :to="`/categories/${category.id}`">
            <div class="category-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.postCount }} 篇文章</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

const categories = ref([])

const loadCategories = async () => {
  try {
    const response = await api.categories.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

onMounted(async () => {
  // 记录访问日志
  await api.stats.trackVisit({ path: '/categories' })
  // 加载分类数据
  await loadCategories()
})
</script>

<style scoped>
.categories-page {
  padding: 4rem 0;
}

.categories-page h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1e293b;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  text-align: center;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.category-card a {
  text-decoration: none;
  color: #1e293b;
  display: block;
}

.category-icon {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #1a73e8;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.category-card:hover .category-icon {
  background: #e2e8f0;
  transform: scale(1.1);
}

.category-icon svg {
  width: 32px;
  height: 32px;
}

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

.category-card:hover .category-name {
  color: #1a73e8;
}

.category-count {
  font-size: 0.875rem;
  color: #64748b;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .categories-page {
    padding: 2rem 0;
  }
  
  .categories-page h1 {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .category-card {
    padding: 1.5rem;
  }
  
  .category-icon {
    width: 56px;
    height: 56px;
  }
  
  .category-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .category-name {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .categories-page h1 {
    font-size: 1.75rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-card {
    padding: 1.25rem;
  }
}
</style>