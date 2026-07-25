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
import { fetchBooks } from '../api'

export default function BooksListScreen({ navigation }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks()
      setBooks(data)
    } catch (e) {
      setError('No se pudo cargar la lista de libros. Revisa que el backend este corriendo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadBooks()
    }, [loadBooks]),
  )

  const formatRating = (value) => (value === null ? 'Sin reseñas' : Number(value).toFixed(1))

  const header = (
    <View>
      <Text style={styles.title}>Prueba tecnica Tidelit Unity S.A.S</Text>
      <Text style={styles.subtitle}>
        Catalogo de libros y sus reseñas. Abre un libro para ver sus calificaciones y agregar la tuya.
      </Text>
      <View style={styles.listHead}>
        <Text style={styles.sectionTitle}>Lista de libros</Text>
        <TouchableOpacity style={styles.refresh} onPress={loadBooks} disabled={loading}>
          <Text style={styles.refreshText}>{loading ? 'Cargando...' : 'Refrescar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const footer = (
    <View style={styles.contact}>
      <Text style={styles.contactName}>Carlos Osia</Text>
      <Text style={styles.contactRole}>Fullstack Developer</Text>
      <Text style={styles.contactLine}>3116665370</Text>
      <Text style={styles.contactLine}>carlos.osia1@gmail.com</Text>
      <Text style={styles.contactLine}>github.com/CarlosOsia1/tidelit</Text>
    </View>
  )

  if (error) {
    return (
      <View style={styles.errorContainer}>
        {header}
        <Text style={styles.error}>{error}</Text>
      </View>
    )
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={books}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator style={styles.loader} color="#2c6cf5" />
        ) : (
          <Text style={styles.meta}>No hay libros para mostrar.</Text>
        )
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
        >
          <View style={styles.info}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.meta}>
              {item.author} - {item.published_year}
            </Text>
          </View>
          <Text style={styles.rating}>{formatRating(item.average_rating)}</Text>
        </TouchableOpacity>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f6f8',
    padding: 16,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2933',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  listHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2933',
  },
  refresh: {
    backgroundColor: '#2c6cf5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  refreshText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e6ea',
    borderRadius: 8,
    padding: 14,
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2933',
    marginBottom: 4,
  },
  meta: {
    color: '#6b7280',
    fontSize: 13,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c6cf5',
  },
  loader: {
    marginTop: 30,
  },
  error: {
    color: '#c0392b',
    marginTop: 16,
  },
  contact: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e3e6ea',
    alignItems: 'center',
  },
  contactName: {
    fontWeight: '600',
    color: '#1f2933',
  },
  contactRole: {
    color: '#6b7280',
    marginBottom: 6,
  },
  contactLine: {
    color: '#2c6cf5',
    fontSize: 13,
    marginTop: 2,
  },
})
