import { API_URL } from './config'

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options)
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const error = new Error('Request failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export function fetchBooks() {
  return request('/api/books')
}

export function fetchBook(id) {
  return request(`/api/books/${id}`)
}

export function createReview(payload) {
  return request('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function deleteReview(id) {
  return request(`/api/reviews/${id}`, { method: 'DELETE' })
}
