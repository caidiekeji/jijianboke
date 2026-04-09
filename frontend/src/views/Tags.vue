<template>
  <div class="tags-page">
    <div class="container">
      <h1>标签</h1>
      <div class="tags-cloud">
        <router-link v-for="tag in tags" :key="tag.id" :to="`/tags/${tag.id}`" class="tag">
          {{ tag.name }}
          <span class="tag-count">({{ tag.postCount }})</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

const tags = ref([])

const loadTags = async () => {
  try {
    const response = await api.tags.getTags()
    tags.value = response.data
  } catch (error) {
    console.error('获取标签列表失败:', error)
  }
}

onMounted(async () => {
  // 记录访问日志
  await api.stats.trackVisit({ path: '/tags' })
  // 加载标签数据
  await loadTags()
})
</script>

<style scoped>
.tags-page {
  padding: 4rem 0;
}

.tags-page h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1e293b;
  text-align: center;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.tag {
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  font-size: 1rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tag:hover {
  background: #1a73e8;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tag-count {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-left: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tags-page {
    padding: 2rem 0;
  }
  
  .tags-page h1 {
    font-size: 2rem;
  }
  
  .tags-cloud {
    gap: 0.75rem;
  }
  
  .tag {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .tags-page h1 {
    font-size: 1.75rem;
  }
  
  .tags-cloud {
    gap: 0.5rem;
  }
  
  .tag {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>