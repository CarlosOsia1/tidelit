<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { deleteReview, fetchBook } from '../api'
import ReviewModal from '../components/ReviewModal.vue'

const route = useRoute()
const bookId = Number(route.params.id)

const book = ref(null)
const loading = ref(false)
const error = ref(null)
const modalOpen = ref(false)
const deletingId = ref(null)

async function loadBook() {
  loading.value = true
  error.value = null
  try {
    book.value = await fetchBook(bookId)
  } catch (e) {
    error.value = 'No se pudo cargar el libro.'
  } finally {
    loading.value = false
  }
}

async function removeReview(id) {
  deletingId.value = id
  try {
    await deleteReview(id)
    await loadBook()
  } catch (e) {
    error.value = 'No se pudo borrar la reseña.'
  } finally {
    deletingId.value = null
  }
}

function onReviewCreated() {
  modalOpen.value = false
  loadBook()
}

function formatRating(value) {
  return value === null ? 'Sin reseñas' : Number(value).toFixed(1)
}

function formatDate(value) {
  return new Date(value).toLocaleString()
}

onMounted(loadBook)
</script>

<template>
  <main class="page">
    <router-link :to="{ name: 'home' }" class="back">Atras</router-link>

    <p v-if="error" class="message error">{{ error }}</p>
    <p v-else-if="loading && !book" class="message">Cargando...</p>

    <template v-else-if="book">
      <header class="book-header">
        <h1>{{ book.title }}</h1>
        <p class="book-meta">{{ book.author }} - {{ book.published_year }}</p>
        <p class="book-rating">Promedio: {{ formatRating(book.average_rating) }}</p>
      </header>

      <section class="section">
        <div class="section-header">
          <h2>Reseñas ({{ book.review_count }})</h2>
          <button class="primary" @click="modalOpen = true">Agregar reseña</button>
        </div>

        <p v-if="book.reviews.length === 0" class="message">Este libro aun no tiene reseñas.</p>

        <ul v-else class="reviews">
          <li v-for="review in book.reviews" :key="review.id" class="review">
            <div class="review-head">
              <span class="review-rating">{{ review.rating }} / 5</span>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
            <button class="danger" :disabled="deletingId === review.id" @click="removeReview(review.id)">
              {{ deletingId === review.id ? 'Borrando...' : 'Borrar' }}
            </button>
          </li>
        </ul>
      </section>
    </template>

    <ReviewModal
      v-if="modalOpen"
      :book-id="bookId"
      @close="modalOpen = false"
      @created="onReviewCreated"
    />
  </main>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 20px;
  color: #2c6cf5;
  text-decoration: none;
  font-size: 0.9rem;
}

.book-header {
  margin-bottom: 28px;
}

.book-header h1 {
  font-size: 1.6rem;
  margin: 0 0 6px;
}

.book-meta {
  margin: 0 0 4px;
  color: #6b7280;
}

.book-rating {
  margin: 0;
  font-weight: 600;
  color: #2c6cf5;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 1.2rem;
  margin: 0;
}

.reviews {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review {
  padding: 14px 16px;
  border: 1px solid #e3e6ea;
  border-radius: 8px;
  background: #ffffff;
}

.review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.review-rating {
  font-weight: 600;
  color: #2c6cf5;
}

.review-date {
  color: #9aa3af;
  font-size: 0.8rem;
}

.review-comment {
  margin: 0 0 12px;
}
</style>
