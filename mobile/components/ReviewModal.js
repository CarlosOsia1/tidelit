import { useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { createReview } from '../api'

export default function ReviewModal({ visible, bookId, onClose, onCreated }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const submit = async () => {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await createReview({ book_id: bookId, rating, comment })
      setComment('')
      onCreated()
    } catch (e) {
      const message =
        e.data && Array.isArray(e.data.errors)
          ? e.data.errors.map((item) => (item.field ? `${item.field}: ` : '') + item.message).join('\n')
          : 'No se pudo registrar la reseña.'
      setErrorMessage(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Nueva reseña</Text>

          <Text style={styles.label}>Calificacion</Text>
          <View style={styles.chips}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.chip, rating === n && styles.chipActive]}
                onPress={() => setRating(n)}
              >
                <Text style={[styles.chipText, rating === n && styles.chipTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Comentario</Text>
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            placeholder="Escribe tu reseña"
            multiline
          />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submit} onPress={submit} disabled={submitting}>
              <Text style={styles.submitText}>{submitting ? 'Enviando...' : 'Registrar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
    marginTop: 8,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#cbd2d9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: '#2c6cf5',
    borderColor: '#2c6cf5',
  },
  chipText: {
    color: '#374151',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd2d9',
    borderRadius: 6,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  error: {
    color: '#c0392b',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  cancel: {
    borderWidth: 1,
    borderColor: '#cbd2d9',
    borderRadius: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: '#374151',
    fontWeight: '600',
  },
  submit: {
    backgroundColor: '#2c6cf5',
    borderRadius: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '600',
  },
})
