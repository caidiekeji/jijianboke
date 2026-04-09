<template>
  <div class="post-detail-page">
    <div class="container">
      <div class="post-detail-content">
        <div class="post-main">
          <div class="post-header">
            <h1>{{ post.title }}</h1>
            <div class="post-meta">
              <span class="post-author">
                <img :src="post.author.avatar || 'https://ui-avatars.com/api/?name=' + post.author.name + '&background=random'" :alt="post.author.name" class="author-avatar" />
                {{ post.author.name }}
              </span>
              <span class="post-date">{{ formatDate(post.createdAt, 'full') }}</span>
              <span class="post-category" v-if="post.category">
                <router-link :to="`/categories/${post.category.id}`">{{ post.category.name }}</router-link>
              </span>
            </div>
          </div>

          <div class="post-body" v-html="renderedContent"></div>

          <div class="post-tags">
            <span class="tags-label">标签：</span>
            <router-link v-for="tag in post.tags" :key="tag.id" :to="`/tags/${tag.id}`" class="tag">
              {{ tag.name }}
            </router-link>
          </div>

          <div class="post-stats">
            <span class="post-views">{{ post.viewCount }} 阅读</span>
            <span class="post-comments">{{ post.commentCount }} 评论</span>
          </div>

          <div class="post-nav">
            <div class="prev-post" v-if="prevPost">
              <span class="nav-label">上一篇：</span>
              <router-link :to="`/posts/${prevPost.id}`">{{ prevPost.title }}</router-link>
            </div>
            <div class="next-post" v-if="nextPost">
              <span class="nav-label">下一篇：</span>
              <router-link :to="`/posts/${nextPost.id}`">{{ nextPost.title }}</router-link>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comments-section">
            <h3>评论 ({{ post.commentCount }})</h3>
            <div class="comment-form" v-if="isAuthenticated">
              <textarea v-model="commentContent" placeholder="写下你的评论..." rows="4"></textarea>
              <button @click="submitComment" class="btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? '提交中...' : '提交评论' }}
              </button>
            </div>
            <div class="login-prompt" v-else>
              <router-link to="/login" class="btn-secondary">登录后评论</router-link>
            </div>

            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="comment-header">
                  <img :src="comment.author?.avatar || 'https://ui-avatars.com/api/?name=' + (comment.author?.name || '匿名') + '&background=random'" :alt="comment.author?.name || '匿名'" class="comment-avatar" />
                  <div class="comment-meta">
                    <span class="comment-author">{{ comment.author?.name || '匿名' }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt, 'full') }}</span>
                  </div>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-actions">
                  <button @click="replyToComment(comment.id)" class="reply-btn">回复</button>
                  <button @click="likeComment(comment.id)" class="like-btn" :class="{ liked: comment.liked }">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {{ comment.likes }}
                  </button>
                </div>
                <div class="reply-form" v-if="replyTo === comment.id">
                  <textarea v-model="replyContent" placeholder="写下你的回复..." rows="3"></textarea>
                  <div class="reply-actions">
                    <button @click="submitReply(comment.id)" class="btn-primary" :disabled="isSubmitting">
                      {{ isSubmitting ? '提交中...' : '提交回复' }}
                    </button>
                    <button @click="cancelReply" class="btn-secondary">取消</button>
                  </div>
                </div>
                <div class="comment-children" v-if="comment.children.length > 0">
                  <div v-for="child in comment.children" :key="child.id" class="comment-item child-comment">
                    <div class="comment-header">
                      <img :src="child.author?.avatar || 'https://ui-avatars.com/api/?name=' + (child.author?.name || '匿名') + '&background=random'" :alt="child.author?.name || '匿名'" class="comment-avatar" />
                      <div class="comment-meta">
                        <span class="comment-author">{{ child.author?.name || '匿名' }}</span>
                        <span class="comment-date">{{ formatDate(child.createdAt, 'full') }}</span>
                      </div>
                    </div>
                    <div class="comment-content">{{ child.content }}</div>
                    <div class="comment-actions">
                      <button @click="likeComment(child.id)" class="like-btn" :class="{ liked: child.liked }">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        {{ child.likes }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="post-sidebar">
          <!-- 相关文章 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">相关文章</h3>
            <ul class="related-posts">
              <li v-for="relatedPost in relatedPosts" :key="relatedPost.id">
                <router-link :to="`/posts/${relatedPost.id}`">
                  <div class="related-post-image">
                    <img :src="relatedPost.cover" :alt="relatedPost.title" />
                  </div>
                  <div class="related-post-content">
                    <h4 class="related-post-title">{{ relatedPost.title }}</h4>
                    <span class="related-post-date">{{ formatDate(relatedPost.createdAt, 'date') }}</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- 热门文章 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">热门文章</h3>
            <ul class="popular-posts">
              <li v-for="popularPost in popularPosts" :key="popularPost.id">
                <router-link :to="`/posts/${popularPost.id}`">
                  <div class="popular-post-image">
                    <img :src="popularPost.cover" :alt="popularPost.title" />
                  </div>
                  <div class="popular-post-content">
                    <h4 class="popular-post-title">{{ popularPost.title }}</h4>
                    <span class="popular-post-views">{{ popularPost.viewCount }} 阅读</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '../utils/date'
import { useUserStore } from '../stores/user'
import api from '../utils/api'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const post = ref({})
const comments = ref([])
const relatedPosts = ref([])
const popularPosts = ref([])
const prevPost = ref(null)
const nextPost = ref(null)

const commentContent = ref('')
const replyContent = ref('')
const replyTo = ref(null)
const isSubmitting = ref(false)

const isAuthenticated = computed(() => userStore.isAuthenticated)

const renderedContent = computed(() => {
  // 这里可以添加 Markdown 渲染逻辑
  return post.value.content || ''
})

const loadPost = async () => {
  try {
    const { id } = route.params
    const response = await api.posts.getPost(id)
    post.value = response.data

    // 获取评论
    const commentsResponse = await api.comments.getComments({ postId: id })
    comments.value = commentsResponse.data

    // 获取相关文章
    const relatedResponse = await api.posts.getRelatedPosts(id, { limit: 5 })
    relatedPosts.value = relatedResponse.data

    // 获取热门文章
    const popularResponse = await api.posts.getPopularPosts({ limit: 5 })
    popularPosts.value = popularResponse.data

    // 获取上一篇和下一篇文章
    const postsResponse = await api.posts.getPosts({ status: 'published', pageSize: 100 })
    const allPosts = postsResponse.data.posts
    const currentIndex = allPosts.findIndex(p => p.id === parseInt(id))

    if (currentIndex > 0) {
      prevPost.value = allPosts[currentIndex - 1]
    }

    if (currentIndex < allPosts.length - 1) {
      nextPost.value = allPosts[currentIndex + 1]
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

const submitComment = async () => {
  if (!commentContent.value.trim()) return

  try {
    isSubmitting.value = true
    await api.comments.createComment({
      postId: post.value.id,
      content: commentContent.value
    })
    commentContent.value = ''
    // 重新加载评论
    const commentsResponse = await api.comments.getComments({ postId: post.value.id })
    comments.value = commentsResponse.data
  } catch (error) {
    console.error('提交评论失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const replyToComment = (commentId) => {
  replyTo.value = commentId
  replyContent.value = ''
}

const cancelReply = () => {
  replyTo.value = null
  replyContent.value = ''
}

const submitReply = async (commentId) => {
  if (!replyContent.value.trim()) return

  try {
    isSubmitting.value = true
    await api.comments.createComment({
      postId: post.value.id,
      content: replyContent.value,
      parentId: commentId
    })
    replyTo.value = null
    replyContent.value = ''
    // 重新加载评论
    const commentsResponse = await api.comments.getComments({ postId: post.value.id })
    comments.value = commentsResponse.data
  } catch (error) {
    console.error('提交回复失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const likeComment = async (commentId) => {
  try {
    await api.comments.likeComment(commentId)
    // 重新加载评论
    const commentsResponse = await api.comments.getComments({ postId: post.value.id })
    comments.value = commentsResponse.data
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

onMounted(async () => {
  // 记录访问日志
  await api.stats.trackVisit({ path: `/posts/${route.params.id}` })
  // 加载文章数据
  await loadPost()
})
</script>

<style scoped>
.post-detail-page {
  padding: 4rem 0;
}

.post-detail-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

/* 文章主体 */
.post-main {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e293b;
  line-height: 1.2;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: #64748b;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.post-category a {
  color: #1a73e8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-category a:hover {
  color: #1557b0;
  text-decoration: underline;
}

.post-body {
  margin-bottom: 2rem;
  line-height: 1.8;
  color: #334155;
}

.post-body h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: #1e293b;
}

.post-body h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: #1e293b;
}

.post-body p {
  margin-bottom: 1rem;
}

.post-body img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.post-body code {
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
}

.post-body pre {
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.post-body pre code {
  background: none;
  padding: 0;
}

.post-body ul,
.post-body ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.post-body li {
  margin-bottom: 0.5rem;
}

.post-tags {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.tag {
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #e2e8f0;
  color: #1a73e8;
}

.post-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.post-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.prev-post,
.next-post {
  flex: 1;
}

.prev-post {
  margin-right: 1rem;
}

.next-post {
  margin-left: 1rem;
  text-align: right;
}

.nav-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
  display: block;
}

.post-nav a {
  color: #1e293b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.post-nav a:hover {
  color: #1a73e8;
}

/* 评论区 */
.comments-section {
  margin-top: 3rem;
}

.comments-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
  min-height: 100px;
}

.comment-form textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.login-prompt {
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  text-align: center;
}

.btn-primary {
  background: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
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

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #334155;
}

.comments-list {
  margin-top: 2rem;
}

.comment-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.child-comment {
  margin-left: 2rem;
  margin-top: 1rem;
  border-left: 2px solid #e2e8f0;
  padding-left: 1rem;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-meta {
  flex: 1;
}

.comment-author {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  display: block;
}

.comment-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.comment-content {
  margin-bottom: 0.75rem;
  line-height: 1.6;
  color: #334155;
}

.comment-actions {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
}

.reply-btn,
.like-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.reply-btn:hover,
.like-btn:hover {
  background: #f1f5f9;
  color: #1a73e8;
}

.like-btn.liked {
  color: #1a73e8;
}

.like-btn svg {
  width: 14px;
  height: 14px;
}

.reply-form {
  margin-top: 1rem;
  margin-left: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.reply-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 0.75rem;
  min-height: 80px;
}

.reply-form textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.reply-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.reply-actions .btn-primary,
.reply-actions .btn-secondary {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

/* 侧边栏 */
.post-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
}

.related-posts,
.popular-posts {
  list-style: none;
}

.related-posts li,
.popular-posts li {
  margin-bottom: 1rem;
}

.related-posts a,
.popular-posts a {
  display: flex;
  gap: 0.75rem;
  text-decoration: none;
  color: #1e293b;
  transition: all 0.2s ease;
}

.related-posts a:hover,
.popular-posts a:hover {
  color: #1a73e8;
}

.related-post-image,
.popular-post-image {
  width: 80px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.related-post-image img,
.popular-post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-post-content,
.popular-post-content {
  flex: 1;
}

.related-post-title,
.popular-post-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-post-date,
.popular-post-views {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .post-detail-content {
    grid-template-columns: 1fr;
  }
  
  .post-sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .sidebar-card {
    flex: 1;
    min-width: 250px;
  }
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 2rem 0;
  }
  
  .post-main {
    padding: 1.5rem;
  }
  
  .post-header h1 {
    font-size: 2rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .prev-post,
  .next-post {
    margin: 0;
    text-align: left;
    width: 100%;
  }
  
  .child-comment {
    margin-left: 1rem;
    padding-left: 0.75rem;
  }
  
  .reply-form {
    margin-left: 1rem;
    padding: 0.75rem;
  }
  
  .post-sidebar {
    flex-direction: column;
  }
  
  .sidebar-card {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .post-main {
    padding: 1.25rem;
  }
  
  .post-header h1 {
    font-size: 1.75rem;
  }
  
  .sidebar-card {
    padding: 1.25rem;
  }
}
</style>