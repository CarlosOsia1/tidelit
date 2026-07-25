import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
})

export function fetchBooks() {
  return apiClient.get('/api/books').then((response) => response.data)
}

export function fetchBook(id) {
  return apiClient.get(`/api/books/${id}`).then((response) => response.data)
}

export function createReview(payload) {
  return apiClient.post('/api/reviews', payload).then((response) => response.data)
}

export function deleteReview(id) {
  return apiClient.delete(`/api/reviews/${id}`)
}
