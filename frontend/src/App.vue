<template>
  <router-view />
</template>

<script setup>
</script>

<style>
:root {
  --color-primary: #1a73e8;
  --color-cta: #1a73e8;
  --color-cta-hover: #1557b0;
  --color-background: #ffffff;
  --color-background-secondary: #f8f9fa;
  --color-border: #e0e0e0;
  --color-text: #202124;
  --color-text-secondary: #5f6368;
  --color-text-muted: #9aa0a6;
  --color-error: #d93025;
  --color-error-bg: #ffebee;
  --color-success: #188038;
  --color-success-bg: #e6f4ea;
  --color-warning: #f29900;
  --color-warning-bg: #fff3cd;
  --color-info: #1a73e8;
  --color-info-bg: #e3f2fd;
  
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
  
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Utility classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.font-light {
  font-weight: var(--font-weight-light);
}

.font-normal {
  font-weight: var(--font-weight-normal);
}

.font-medium {
  font-weight: var(--font-weight-medium);
}

.font-semibold {
  font-weight: var(--font-weight-semibold);
}

.font-bold {
  font-weight: var(--font-weight-bold);
}

.text-xs {
  font-size: var(--font-size-xs);
}

.text-sm {
  font-size: var(--font-size-sm);
}

.text-base {
  font-size: var(--font-size-base);
}

.text-lg {
  font-size: var(--font-size-lg);
}

.text-xl {
  font-size: var(--font-size-xl);
}

.text-2xl {
  font-size: var(--font-size-2xl);
}

.text-3xl {
  font-size: var(--font-size-3xl);
}

.mt-1 { margin-top: var(--spacing-1); }
.mt-2 { margin-top: var(--spacing-2); }
.mt-3 { margin-top: var(--spacing-3); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-5 { margin-top: var(--spacing-5); }
.mt-6 { margin-top: var(--spacing-6); }
.mt-8 { margin-top: var(--spacing-8); }
.mt-10 { margin-top: var(--spacing-10); }

.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-5 { margin-bottom: var(--spacing-5); }
.mb-6 { margin-bottom: var(--spacing-6); }
.mb-8 { margin-bottom: var(--spacing-8); }
.mb-10 { margin-bottom: var(--spacing-10); }

.ml-1 { margin-left: var(--spacing-1); }
.ml-2 { margin-left: var(--spacing-2); }
.ml-3 { margin-left: var(--spacing-3); }
.ml-4 { margin-left: var(--spacing-4); }
.ml-5 { margin-left: var(--spacing-5); }
.ml-6 { margin-left: var(--spacing-6); }

.mr-1 { margin-right: var(--spacing-1); }
.mr-2 { margin-right: var(--spacing-2); }
.mr-3 { margin-right: var(--spacing-3); }
.mr-4 { margin-right: var(--spacing-4); }
.mr-5 { margin-right: var(--spacing-5); }
.mr-6 { margin-right: var(--spacing-6); }

.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-3 { padding: var(--spacing-3); }
.p-4 { padding: var(--spacing-4); }
.p-5 { padding: var(--spacing-5); }
.p-6 { padding: var(--spacing-6); }

.pt-1 { padding-top: var(--spacing-1); }
.pt-2 { padding-top: var(--spacing-2); }
.pt-3 { padding-top: var(--spacing-3); }
.pt-4 { padding-top: var(--spacing-4); }
.pt-5 { padding-top: var(--spacing-5); }
.pt-6 { padding-top: var(--spacing-6); }
.pt-8 { padding-top: var(--spacing-8); }

.pb-1 { padding-bottom: var(--spacing-1); }
.pb-2 { padding-bottom: var(--spacing-2); }
.pb-3 { padding-bottom: var(--spacing-3); }
.pb-4 { padding-bottom: var(--spacing-4); }
.pb-5 { padding-bottom: var(--spacing-5); }
.pb-6 { padding-bottom: var(--spacing-6); }
.pb-8 { padding-bottom: var(--spacing-8); }

.pl-1 { padding-left: var(--spacing-1); }
.pl-2 { padding-left: var(--spacing-2); }
.pl-3 { padding-left: var(--spacing-3); }
.pl-4 { padding-left: var(--spacing-4); }
.pl-5 { padding-left: var(--spacing-5); }
.pl-6 { padding-left: var(--spacing-6); }

.pr-1 { padding-right: var(--spacing-1); }
.pr-2 { padding-right: var(--spacing-2); }
.pr-3 { padding-right: var(--spacing-3); }
.pr-4 { padding-right: var(--spacing-4); }
.pr-5 { padding-right: var(--spacing-5); }
.pr-6 { padding-right: var(--spacing-6); }

/* Responsive utilities */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-4);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #8ab4f8;
    --color-cta: #8ab4f8;
    --color-cta-hover: #669df6;
    --color-background: #121212;
    --color-background-secondary: #1e1e1e;
    --color-border: #333333;
    --color-text: #e0e0e0;
    --color-text-secondary: #b0b0b0;
    --color-text-muted: #808080;
  }
}
</style>