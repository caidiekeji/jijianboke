<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>页面不存在</h2>
        <p>您访问的页面不存在或已被删除。</p>
        <router-link to="/" class="btn-primary">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 页面组件
</script>

<style scoped>
.not-found-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.not-found-content {
  text-align: center;
  background: white;
  padding: 4rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
}

.not-found-content h1 {
  font-size: 6rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 1rem;
  line-height: 1;
}

.not-found-content h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.not-found-content p {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
  background: #1a73e8;
  color: white;
  padding: 1rem 2rem;
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

@media (max-width: 768px) {
  .not-found-content {
    padding: 3rem;
  }
  
  .not-found-content h1 {
    font-size: 4rem;
  }
  
  .not-found-content h2 {
    font-size: 1.5rem;
  }
  
  .not-found-content p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 2rem;
  }
  
  .not-found-content h1 {
    font-size: 3rem;
  }
  
  .not-found-content h2 {
    font-size: 1.25rem;
  }
  
  .btn-primary {
    padding: 0.75rem 1.5rem;
  }
}
</style>