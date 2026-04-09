<template>
  <div class="settings-page">
    <h1>网站设置</h1>
    <div class="settings-form">
      <div class="form-section">
        <h2>基本设置</h2>
        <div class="form-group">
          <label for="siteTitle">网站标题</label>
          <input type="text" id="siteTitle" v-model="settings.siteTitle" class="form-input" />
        </div>
        <div class="form-group">
          <label for="siteDescription">网站描述</label>
          <textarea id="siteDescription" v-model="settings.siteDescription" rows="3" class="form-textarea"></textarea>
        </div>
        <div class="form-group">
          <label for="siteKeywords">网站关键词</label>
          <input type="text" id="siteKeywords" v-model="settings.siteKeywords" class="form-input" placeholder="用逗号分隔" />
        </div>
      </div>
      <div class="form-section">
        <h2>功能设置</h2>
        <div class="form-group checkbox-group">
          <input type="checkbox" id="enableAnalytics" v-model="settings.enableAnalytics" />
          <label for="enableAnalytics">启用访问统计</label>
        </div>
        <div class="form-group checkbox-group">
          <input type="checkbox" id="enableRss" v-model="settings.enableRss" />
          <label for="enableRss">启用 RSS 订阅</label>
        </div>
        <div class="form-group checkbox-group">
          <input type="checkbox" id="enableSitemap" v-model="settings.enableSitemap" />
          <label for="enableSitemap">启用站点地图</label>
        </div>
      </div>
      <div class="form-actions">
        <button @click="saveSettings" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../../stores/settings'

const settingsStore = useSettingsStore()

const settings = ref({
  siteTitle: '我的博客',
  siteDescription: '分享技术、记录生活、探索未知',
  siteKeywords: '博客, 技术, 生活, 学习',
  enableAnalytics: true,
  enableRss: true,
  enableSitemap: true
})

const isLoading = ref(false)

const loadSettings = async () => {
  try {
    const settingsData = await settingsStore.fetchSettings()
    settings.value = settingsData
  } catch (error) {
    console.error('获取设置失败:', error)
  }
}

const saveSettings = async () => {
  try {
    isLoading.value = true
    await settingsStore.updateSettings(settings.value)
    alert('设置保存成功')
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存失败，请重试')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadSettings()
})
</script>

<style scoped>
.settings-page {
  padding: 2rem;
}

.settings-page h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
}

.settings-form {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #334155;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
}

.form-actions {
  margin-top: 2rem;
  text-align: right;
}

.btn-primary {
  background: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-page {
    padding: 1.5rem;
  }
  
  .settings-form {
    padding: 1.5rem;
  }
  
  .settings-page h1 {
    font-size: 1.75rem;
  }
  
  .form-section h2 {
    font-size: 1.125rem;
  }
  
  .form-input,
  .form-textarea {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
  
  .btn-primary {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .settings-page {
    padding: 1.25rem;
  }
  
  .settings-form {
    padding: 1.25rem;
  }
  
  .settings-page h1 {
    font-size: 1.5rem;
  }
}
</style>