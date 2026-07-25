<script setup>
import { ref } from 'vue'
import { createReview } from '../api'

const props = defineProps({
  bookId: { type: Number, required: true },
})

const emit = defineEmits(['close', 'created'])

const rating = ref(5)
const comment = ref('')
const submitting = ref(false)
const errors = ref([])

async function submit() {
  submitting.value = true
  errors.value = []
  try {
    await createReview({
      book_id: props.bookId,
      rating: Number(rating.value),
      comment: comment.value,
    })
    emit('created')
  } catch (e) {
    if (e.response && e.response.data && Array.isArray(e.response.data.errors)) {
      errors.value = e.response.data.errors
    } else {
      errors.value = [{ field: null, message: 'No se pudo registrar la reseña.' }]
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>Nueva reseña</h3>
        <button class="close" aria-label="Cerrar" @click="emit('close')">x</button>
      </div>

      <form @submit.prevent="submit">
        <label class="field">
          <span>Calificacion</span>
          <select v-model="rating">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>

        <label class="field">
          <span>Comentario</span>
          <textarea v-model="comment" rows="4"></textarea>
        </label>

        <ul v-if="errors.length" class="form-errors">
          <li v-for="(err, index) in errors" :key="index">
            {{ err.field ? err.field + ': ' : '' }}{{ err.message }}
          </li>
        </ul>

        <div class="modal-actions">
          <button type="button" class="secondary" @click="emit('close')">Cancelar</button>
          <button type="submit" class="primary" :disabled="submitting">
            {{ submitting ? 'Enviando...' : 'Registrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10;
}

.modal {
  background: #ffffff;
  border-radius: 10px;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  color: #6b7280;
  padding: 0 6px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 0.9rem;
  color: #374151;
}

.field select,
.field textarea {
  padding: 8px 10px;
  border: 1px solid #cbd2d9;
  border-radius: 6px;
  font: inherit;
}

.form-errors {
  margin: 0 0 14px;
  padding-left: 18px;
  color: #c0392b;
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
