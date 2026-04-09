<template>
  <div class="login-page">
    <div class="container">
      <div class="login-form">
        <h2>登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" v-model="formData.email" required placeholder="请输入邮箱" />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" v-model="formData.password" required placeholder="请输入密码" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </div>
          <div class="form-links">
            <router-link to="/register">还没有账号？立即注册</router-link>
          </div>
        </form>
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  email: '',
  password: ''
})

const isLoading = computed(() => userStore.isLoading)
const error = computed(() => userStore.error)

const handleLogin = async () => {
  try {
    await userStore.login(formData.value)
    // 登录成功后跳转到首页
    router.push('/')
  } catch (error) {
    // 错误处理已在 store 中完成
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  width: 100%;
}

.login-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #334155;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.form-actions {
  margin-top: 1.5rem;
}

.btn-primary {
  width: 100%;
  background: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #1557b0;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

.form-links {
  margin-top: 1rem;
  text-align: center;
}

.form-links a {
  color: #1a73e8;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.form-links a:hover {
  color: #1557b0;
  text-decoration: underline;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #ffebee;
  color: #d32f2f;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .login-form h2 {
    font-size: 1.25rem;
  }
  
  .form-group input {
    padding: 0.625rem 0.875rem;
  }
  
  .btn-primary {
    padding: 0.625rem 1.25rem;
  }
}
</style>