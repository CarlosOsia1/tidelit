import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { deleteReview, fetchBook } from '../api'
import ReviewModal from '../components/ReviewModal'

export default function BookDetailScreen({ route }) {
  const { bookId } = route.params
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const loadBook = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBook(bookId)
      setBook(data)
    } catch (e) {
      setError('No se pudo cargar el libro.')
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useFocusEffect(
    useCallback(() => {
      loadBook()
    }, [loadBook]),
  )

  const removeReview = async (id) => {
    setDeletingId(id)
    try {
      await deleteReview(id)
      await loadBook()
    } catch (e) {
      setError('No se pudo borrar la reseña.')
    } finally {
      setDeletingId(null)
    }
  }

  const onCreated = () => {
    setModalVisible(false)
    loadBook()
  }

  const formatRating = (value) => (value === null ? 'Sin reseñas' : Number(value).toFixed(1))
  const formatDate = (value) => new Date(value).toLocaleString()

  if (loading && !book) {
    return <ActivityIndicator style={styles.loader} size="large" color="#2c6cf5" />
  }

  if (error && !book) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    )
  }

  if (!book) {
    return null
  }

  const header = (
    <View>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.meta}>
        {book.author} - {book.published_year}
      </Text>
      <Text style={styles.average}>Promedio: {formatRating(book.average_rating)}</Text>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Reseñas ({book.review_count})</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Agregar reseña</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={book.reviews}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        ListEmptyComponent={<Text style={styles.meta}>Este libro aun no tiene reseñas.</Text>}
        renderItem={({ item }) => (
          <View style={styles.review}>
            <View style={styles.reviewHead}>
              <Text style={styles.reviewRating}>{item.rating} / 5</Text>
              <Text style={styles.reviewDate}>{formatDate(item.created_at)}</Text>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeReview(item.id)}
              disabled={deletingId === item.id}
            >
              <Text style={styles.deleteButtonText}>
                {deletingId === item.id ? 'Borrando...' : 'Borrar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <ReviewModal
        visible={modalVisible}
        bookId={bookId}
        onClose={() => setModalVisible(false)}
        onCreated={onCreated}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2933',
  },
  meta: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  average: {
    color: '#2c6cf5',
    fontWeight: '600',
    marginTop: 6,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2933',
  },
  addButton: {
    backgroundColor: '#2c6cf5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  review: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e6ea',
    borderRadius: 8,
    padding: 14,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewRating: {
    fontWeight: '600',
    color: '#2c6cf5',
  },
  reviewDate: {
    color: '#9aa3af',
    fontSize: 12,
  },
  reviewComment: {
    color: '#1f2933',
    marginBottom: 12,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0b4b4',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  deleteButtonText: {
    color: '#c0392b',
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
  error: {
    color: '#c0392b',
    margin: 16,
  },
})
