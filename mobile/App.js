import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import BooksListScreen from './screens/BooksListScreen'
import BookDetailScreen from './screens/BookDetailScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2c6cf5' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="Books" component={BooksListScreen} options={{ title: 'Tidelit Libros' }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Detalle del libro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
