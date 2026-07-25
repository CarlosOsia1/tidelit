import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import BookDetailView from './views/BookDetailView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/books/:id', name: 'book-detail', component: BookDetailView, props: true },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
