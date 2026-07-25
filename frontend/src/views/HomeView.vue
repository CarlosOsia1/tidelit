<script setup>
import { onMounted, ref } from 'vue'
import { fetchBooks } from '../api'

const books = ref([])
const loading = ref(false)
const error = ref(null)

async function loadBooks() {
  loading.value = true
  error.value = null
  try {
    books.value = await fetchBooks()
  } catch (e) {
    error.value = 'No se pudo cargar la lista de libros. Revisa que el backend este corriendo.'
  } finally {
    loading.value = false
  }
}

function formatRating(value) {
  return value === null ? 'Sin reseñas' : Number(value).toFixed(1)
}

onMounted(loadBooks)
</script>

<template>
  <main class="page">
    <header class="hero">
      <h1>Prueba tecnica Tidelit Unity S.A.S</h1>
      <p class="subtitle">
        Catalogo de libros y sus reseñas. Abre un libro para ver sus calificaciones y agregar la tuya.
      </p>
    </header>

    <section class="section">
      <div class="section-header">
        <h2>Lista de libros</h2>
        <button class="refresh" :disabled="loading" @click="loadBooks">
          {{ loading ? 'Cargando...' : 'Refrescar' }}
        </button>
      </div>

      <p v-if="error" class="message error">{{ error }}</p>

      <ul v-else class="list">
        <li v-for="book in books" :key="book.id">
          <router-link :to="{ name: 'book-detail', params: { id: book.id } }" class="item">
            <div class="info">
              <span class="title">{{ book.title }}</span>
              <span class="meta">{{ book.author }} - {{ book.published_year }}</span>
            </div>
            <span class="rating">{{ formatRating(book.average_rating) }}</span>
          </router-link>
        </li>
      </ul>

      <p v-if="!error && !loading && books.length === 0" class="message">No hay libros para mostrar.</p>
    </section>
  </main>
</template>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero h1 {
  font-size: 1.7rem;
  margin: 0 0 10px;
}

.subtitle {
  margin: 0 auto;
  max-width: 480px;
  color: #6b7280;
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

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid #e3e6ea;
  border-radius: 8px;
  background: #ffffff;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s;
}

.item:hover {
  border-color: #2c6cf5;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-weight: 600;
}

.meta {
  color: #6b7280;
  font-size: 0.85rem;
}

.rating {
  font-weight: 600;
  color: #2c6cf5;
  white-space: nowrap;
  margin-left: 12px;
}
</style>
