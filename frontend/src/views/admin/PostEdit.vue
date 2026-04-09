<template>
  <div class="post-edit-page">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
      <div class="header-actions">
        <button @click="saveDraft" class="btn-secondary">保存草稿</button>
        <button @click="publishPost" class="btn-primary">发布</button>
      </div>
    </div>
    <div class="post-edit-form">
      <div class="form-section">
        <div class="form-group">
          <label for="title">标题</label>
          <input type="text" id="title" v-model="formData.title" placeholder="请输入标题" class="form-input" />
        </div>
        <div class="form-group">
          <label for="excerpt">摘要</label>
          <textarea id="excerpt" v-model="formData.excerpt" placeholder="请输入摘要" rows="3" class="form-textarea"></textarea>
        </div>
        <div class="form-group">
          <label for="content">内容</label>
          <div class="markdown-editor">
            <div class="editor-toolbar">
              <button @click="insertMarkdown('**', '**')" class="toolbar-btn"><strong>B</strong></button>
              <button @click="insertMarkdown('*', '*')" class="toolbar-btn"><em>I</em></button>
              <button @click="insertMarkdown('`', '`')" class="toolbar-btn">`</button>
              <button @click="insertMarkdown('```\n', '\n```')" class="toolbar-btn">Code</button>
              <button @click="insertMarkdown('# ', '')" class="toolbar-btn">H1</button>
              <button @click="insertMarkdown('## ', '')" class="toolbar-btn">H2</button>
              <button @click="insertMarkdown('### ', '')" class="toolbar-btn">H3</button>
              <button @click="insertMarkdown('- ', '')" class="toolbar-btn">List</button>
              <button @click="insertMarkdown('![alt text](', ')')" class="toolbar-btn">Image</button>
              <button @click="insertMarkdown('[', '](url)')" class="toolbar-btn">Link</button>
            </div>
            <textarea id="content" v-model="formData.content" placeholder="请输入内容（支持 Markdown）" rows="15" class="form-textarea editor-textarea"></textarea>
          </div>
        </div>
      </div>
      <div class="form-sidebar">
        <div class="sidebar-section">
          <h3>分类</h3>
          <select v-model="formData.categoryId" class="form-select">
            <option value="">未分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="sidebar-section">
          <h3>标签</h3>
          <div class="tags-selector">
            <div v-for="tag in tags" :key="tag.id" class="tag-checkbox">
              <input type="checkbox" :id="`tag-${tag.id}`" :value="tag.id" v-model="selectedTags" />
              <label :for="`tag-${tag.id}`">{{ tag.name }}</label>
            </div>
          </div>
        </div>
        <div class="sidebar-section">
          <h3>特色图片</h3>
          <div class="featured-image">
            <input type="text" v-model="formData.cover" placeholder="请输入图片 URL" class="form-input" />
            <div class="image-preview" v-if="formData.cover">
              <img :src="formData.cover" :alt="formData.title" />
            </div>
          </div>
        </div>
        <div class="sidebar-section">
          <h3>状态</h3>
          <select v-model="formData.status" class="form-select">
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../utils/api'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const formData = ref({
  title: '',
  content: '',
  excerpt: '',
  cover: '',
  status: 'draft',
  categoryId: '',
  tagIds: []
})

const selectedTags = ref([])
const categories = ref([])
const tags = ref([])

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

const loadPost = async () => {
  try {
    const { id } = route.params
    const response = await api.posts.getPost(id)
    const post = response.data
    formData.value = {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      cover: post.cover,
      status: post.status,
      categoryId: post.categoryId || '',
      tagIds: post.tags.map(tag => tag.id)
    }
    selectedTags.value = post.tags.map(tag => tag.id)
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

const insertMarkdown = (prefix, suffix) => {
  const textarea = document.getElementById('content')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = formData.value.content
  const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end)
  formData.value.content = newText
  // 聚焦到插入后的位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length, start + prefix.length + (end - start))
  }, 0)
}

const saveDraft = async () => {
  await savePost('draft')
}

const publishPost = async () => {
  await savePost('published')
}

const savePost = async (status) => {
  try {
    formData.value.status = status
    formData.value.tagIds = selectedTags.value
    
    if (isEdit.value) {
      await api.posts.updatePost(route.params.id, formData.value)
      alert('更新成功')
    } else {
      await api.posts.createPost(formData.value)
      alert('创建成功')
      router.push('/admin/posts')
    }
  } catch (error) {
    console.error('保存文章失败:', error)
    alert('保存失败，请重试')
  }
}

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadTags()
  ])
  
  if (isEdit.value) {
    await loadPost()
  }
})

// 监听标签选择变化
watch(selectedTags, (newTags) => {
  formData.value.tagIds = newTags
})
</script>

<style scoped>
.post-edit-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.header-actions {
  display: flex;
  gap: 1rem;
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

.btn-primary:hover {
  background: #1557b0;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #334155;
}

.post-edit-form {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.form-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.markdown-editor {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.editor-toolbar {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.toolbar-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.toolbar-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.editor-textarea {
  border: none;
  border-radius: 0;
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
}

.editor-textarea:focus {
  outline: none;
  box-shadow: none;
}

.form-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.sidebar-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
}

.tags-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.tag-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.tag-checkbox label {
  cursor: pointer;
  color: #64748b;
}

.featured-image {
  position: relative;
}

.image-preview {
  margin-top: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  max-height: 200px;
}

.image-preview img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .post-edit-form {
    grid-template-columns: 1fr;
  }
  
  .form-sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .sidebar-section {
    flex: 1;
    min-width: 250px;
  }
}

@media (max-width: 768px) {
  .post-edit-page {
    padding: 1.5rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .form-section {
    padding: 1.5rem;
  }
  
  .sidebar-section {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
  
  .toolbar-btn {
    padding: 0.25rem 0.4rem;
    font-size: 0.75rem;
  }
  
  .editor-textarea {
    min-height: 200px;
  }
}
</style>