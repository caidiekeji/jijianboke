<template>
  <div class="about-page">
    <div class="container">
      <h1>关于我</h1>
      <div class="about-content">
        <div class="about-intro">
          <p>你好，我是一名热爱技术的开发者，专注于前端和后端开发。</p>
          <p>这个博客是我用来记录学习心得、分享技术经验的地方。我希望通过这个平台，与大家交流技术，共同进步。</p>
          <p>我擅长的技术栈包括：</p>
          <ul>
            <li>前端：HTML、CSS、JavaScript、Vue.js、React</li>
            <li>后端：Node.js、Express、MongoDB、PostgreSQL</li>
            <li>其他：Git、Docker、Linux</li>
          </ul>
        </div>
        <div class="about-contact">
          <h2>联系方式</h2>
          <p>邮箱：contact@example.com</p>
          <p>GitHub：<a href="https://github.com" target="_blank">github.com</a></p>
          <p>微信：example_wechat</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 关于页面组件
</script>

<style scoped>
.about-page {
  padding: 4rem 0;
}

.about-page h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
  text-align: center;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

.about-intro {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.about-intro p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #64748b;
}

.about-intro ul {
  margin-left: 1.5rem;
  margin-top: 1rem;
}

.about-intro li {
  margin-bottom: 0.5rem;
  color: #64748b;
}

.about-contact {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.about-contact h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.about-contact p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #64748b;
}

.about-contact a {
  color: #1a73e8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.about-contact a:hover {
  color: #1557b0;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
  }
  
  .about-page h1 {
    font-size: 2rem;
  }
  
  .about-intro,
  .about-contact {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .about-page {
    padding: 2rem 0;
  }
  
  .about-page h1 {
    font-size: 1.75rem;
  }
  
  .about-intro,
  .about-contact {
    padding: 1.25rem;
  }
}
</style>