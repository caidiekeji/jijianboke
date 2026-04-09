<template>
  <div class="markdown-renderer" v-html="renderedMarkdown"></div>
</template>

<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  markdown: {
    type: String,
    default: ''
  }
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const renderedMarkdown = computed(() => {
  return md.render(props.markdown)
})
</script>

<style scoped>
.markdown-renderer {
  line-height: 1.8;
  color: #334155;
}

.markdown-renderer h1,
.markdown-renderer h2,
.markdown-renderer h3,
.markdown-renderer h4,
.markdown-renderer h5,
.markdown-renderer h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.markdown-renderer h1 {
  font-size: 2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.markdown-renderer h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.markdown-renderer h3 {
  font-size: 1.25rem;
}

.markdown-renderer h4 {
  font-size: 1.125rem;
}

.markdown-renderer h5 {
  font-size: 1rem;
}

.markdown-renderer h6 {
  font-size: 0.875rem;
  color: #64748b;
}

.markdown-renderer p {
  margin-bottom: 1rem;
}

.markdown-renderer ul,
.markdown-renderer ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-renderer li {
  margin-bottom: 0.5rem;
}

.markdown-renderer a {
  color: #1a73e8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.markdown-renderer a:hover {
  color: #1557b0;
  text-decoration: underline;
}

.markdown-renderer code {
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  color: #334155;
}

.markdown-renderer pre {
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-renderer pre code {
  background: none;
  padding: 0;
  font-size: 0.875rem;
  color: #334155;
}

.markdown-renderer blockquote {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  margin-bottom: 1rem;
  color: #64748b;
  font-style: italic;
}

.markdown-renderer img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.markdown-renderer table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.markdown-renderer table th,
.markdown-renderer table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.markdown-renderer table th {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

.markdown-renderer table tr:hover {
  background: #f8fafc;
}
</style>