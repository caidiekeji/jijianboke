<template>
  <div class="default-layout">
    <!-- 顶部导航栏 -->
    <header class="navbar">
      <div class="container">
        <div class="navbar-content">
          <router-link to="/" class="navbar-logo">
            {{ siteTitle }}
          </router-link>
          
          <nav class="navbar-nav">
            <router-link to="/" class="nav-link" active-class="active">首页</router-link>
            <router-link to="/posts" class="nav-link" active-class="active">文章</router-link>
            <router-link to="/categories" class="nav-link" active-class="active">分类</router-link>
            <router-link to="/tags" class="nav-link" active-class="active">标签</router-link>
            <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
          </nav>
          
          <div class="navbar-actions">
            <div class="search-form">
              <input type="text" v-model="searchQuery" placeholder="搜索文章..." class="search-input" />
              <button @click="handleSearch" class="search-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
            
            <div class="user-menu" v-if="isAuthenticated">
              <button class="user-menu-button" @click="toggleUserMenu">
                <img :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name + '&background=random'" :alt="user?.name" class="user-avatar" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-icon">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              
              <div class="user-menu-dropdown" v-if="userMenuOpen">
                <router-link to="/profile" class="dropdown-item">个人资料</router-link>
                <router-link to="/admin" class="dropdown-item" v-if="isAdmin">管理后台</router-link>
                <button class="dropdown-item" @click="logout">退出登录</button>
              </div>
            </div>
            
            <div class="auth-buttons" v-else>
              <router-link to="/login" class="btn-login">登录</router-link>
              <router-link to="/register" class="btn-register">注册</router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <slot></slot>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3>{{ siteTitle }}</h3>
            <p>{{ siteDescription }}</p>
          </div>
          
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/posts">文章</router-link></li>
              <li><router-link to="/categories">分类</router-link></li>
              <li><router-link to="/tags">标签</router-link></li>
              <li><router-link to="/about">关于</router-link></li>
            </ul>
          </div>
          
          <div class="footer-contact">
            <h4>联系我们</h4>
            <p>邮箱: contact@example.com</p>
            <p>版权所有 © {{ new Date().getFullYear() }}</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useSettingsStore } from '../stores/settings'

const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const searchQuery = ref('')
const userMenuOpen = ref(false)

// 计算属性
const isAuthenticated = computed(() => userStore.isAuthenticated)
const isAdmin = computed(() => userStore.isAdmin)
const user = computed(() => userStore.user)
const siteTitle = computed(() => settingsStore.siteTitle)
const siteDescription = computed(() => settingsStore.siteDescription)

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

// 用户菜单
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

// 退出登录
const logout = async () => {
  await userStore.logout()
  userMenuOpen.value = false
  router.push('/')
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu')
  if (userMenu && !userMenu.contains(event.target)) {
    userMenuOpen.value = false
  }
}

// 初始化
onMounted(async () => {
  // 获取用户信息
  if (userStore.token) {
    await userStore.fetchCurrentUser()
  }
  
  // 获取网站设置
  await settingsStore.fetchSettings()
  
  // 添加点击外部关闭菜单的事件监听
  document.addEventListener('click', handleClickOutside)
})

// 清理
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a73e8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-logo:hover {
  color: #1557b0;
}

.navbar-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #1e293b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #1a73e8;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1a73e8;
  border-radius: 2px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-form {
  position: relative;
}

.search-input {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 2rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
  width: 250px;
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
  border-radius: 50%;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #f1f5f9;
  color: #1a73e8;
}

.user-menu {
  position: relative;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.user-menu-button:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.menu-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 160px;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #1e293b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f1f5f9;
  color: #1a73e8;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-login {
  color: #1a73e8;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.btn-login:hover {
  background: rgba(26, 115, 232, 0.05);
}

.btn-register {
  background: #1a73e8;
  color: white;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.btn-register:hover {
  background: #1557b0;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 2rem 0;
}

/* 页脚 */
.footer {
  background: #1e293b;
  color: white;
  padding: 4rem 0 2rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.footer-info p {
  color: #94a3b8;
  line-height: 1.6;
}

.footer-links h4,
.footer-contact h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-contact p {
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .navbar-nav {
    width: 100%;
    justify-content: space-between;
  }
  
  .navbar-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-input {
    width: 100%;
  }
  
  .search-input:focus {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .navbar-nav {
    gap: 1rem;
  }
  
  .nav-link {
    font-size: 0.875rem;
  }
  
  .auth-buttons {
    gap: 0.5rem;
  }
  
  .btn-login,
  .btn-register {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
}
</style>