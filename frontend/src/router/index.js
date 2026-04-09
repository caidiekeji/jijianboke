import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import(/* webpackChunkName: "posts" */ '../views/Posts.vue')
    },
    {
      path: '/posts/:id',
      name: 'postDetail',
      component: () => import(/* webpackChunkName: "postDetail" */ '../views/PostDetail.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import(/* webpackChunkName: "categories" */ '../views/Categories.vue')
    },
    {
      path: '/categories/:id',
      name: 'categoryPosts',
      component: () => import(/* webpackChunkName: "categoryPosts" */ '../views/Posts.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import(/* webpackChunkName: "tags" */ '../views/Tags.vue')
    },
    {
      path: '/tags/:id',
      name: 'tagPosts',
      component: () => import(/* webpackChunkName: "tagPosts" */ '../views/Posts.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Dashboard.vue')
    },
    {
      path: '/admin/posts',
      name: 'adminPosts',
      component: () => import(/* webpackChunkName: "adminPosts" */ '../views/admin/Posts.vue')
    },
    {
      path: '/admin/posts/create',
      name: 'createPost',
      component: () => import(/* webpackChunkName: "createPost" */ '../views/admin/PostEdit.vue')
    },
    {
      path: '/admin/posts/:id',
      name: 'editPost',
      component: () => import(/* webpackChunkName: "editPost" */ '../views/admin/PostEdit.vue')
    },
    {
      path: '/admin/categories',
      name: 'adminCategories',
      component: () => import(/* webpackChunkName: "adminCategories" */ '../views/admin/Categories.vue')
    },
    {
      path: '/admin/tags',
      name: 'adminTags',
      component: () => import(/* webpackChunkName: "adminTags" */ '../views/admin/Tags.vue')
    },
    {
      path: '/admin/comments',
      name: 'adminComments',
      component: () => import(/* webpackChunkName: "adminComments" */ '../views/admin/Comments.vue')
    },
    {
      path: '/admin/settings',
      name: 'adminSettings',
      component: () => import(/* webpackChunkName: "adminSettings" */ '../views/admin/Settings.vue')
    },
    {
      path: '/admin/users',
      name: 'adminUsers',
      component: () => import(/* webpackChunkName: "adminUsers" */ '../views/admin/Users.vue')
    },
    {
      path: '/admin/stats',
      name: 'adminStats',
      component: () => import(/* webpackChunkName: "adminStats" */ '../views/admin/Stats.vue')
    },
    {
      path: '/admin/db',
      name: 'adminDb',
      component: () => import(/* webpackChunkName: "adminDb" */ '../views/admin/DbManagement.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import(/* webpackChunkName: "notFound" */ '../views/NotFound.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router