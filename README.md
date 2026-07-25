# Tidelit Libros

API REST en Symfony 6 para gestionar libros y sus reseñas, con dos clientes que consumen la misma API: una vista web en Vue 3 y una app móvil en React Native (Expo). Ambos clientes listan los libros con su promedio, abren el detalle de un libro con sus reseñas, y permiten crear una reseña (en un modal) y borrarla.

El repositorio contiene tres proyectos:

- `backend/`: API REST en Symfony 6 + Doctrine ORM + PostgreSQL.
- `frontend/`: cliente web en Vue 3 (Vite).
- `mobile/`: cliente móvil en React Native con Expo.

## Requisitos

- PHP 8.2 o superior con las extensiones `pdo_pgsql`, `intl`, `mbstring` y `openssl`.
- Composer 2.
- PostgreSQL 14 o superior.
- Node.js 18 o superior y npm.
- Expo (se ejecuta con `npx`, no requiere instalación global). Para probar en un teléfono, la app Expo Go.

## Backend (Symfony)

### Instalación

```bash
git clone https://github.com/CarlosOsia1/tidelit.git
cd tidelit/backend
cp .env.example .env
```

Edita `DATABASE_URL` en `.env` con las credenciales de tu PostgreSQL. Formato:

```
DATABASE_URL="postgresql://USUARIO:PASSWORD@127.0.0.1:5432/tidelit?serverVersion=17&charset=utf8"
```

Instala dependencias, crea la base de datos, corre las migraciones y carga los datos de ejemplo:

```bash
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

### Ejecutar

Con la Symfony CLI:

```bash
symfony server:start
```

O con el servidor embebido de PHP:

```bash
php -S 127.0.0.1:8000 -t public
```

La API queda disponible en `http://127.0.0.1:8000`.

Para probar la app móvil en un dispositivo físico, levanta el backend escuchando en la red local en lugar de en loopback:

```bash
php -S 0.0.0.0:8000 -t public
```

### Tests

Las pruebas funcionales usan una base de datos separada (`tidelit_test`, sufijo que Doctrine añade en el entorno de test). Créala, aplica el esquema y ejecuta la suite:

```bash
php bin/console doctrine:database:create --env=test
php bin/console doctrine:migrations:migrate --env=test --no-interaction
php bin/phpunit
```

Cubren `GET /api/books` (incluido el promedio y el caso de un libro sin reseñas que devuelve `null`), `GET /api/books/{id}` (detalle con reseñas y su 404), `POST /api/reviews` (creación exitosa y los casos de validación que devuelven 400) y `DELETE /api/reviews/{id}` (borrado y su 404).

## Frontend web (Vue)

```bash
cd frontend
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`). La URL de la API se configura en `frontend/.env` con la variable `VITE_API_URL` (por defecto `http://127.0.0.1:8000`).

## Móvil (React Native / Expo)

```bash
cd mobile
npm install
npx expo start
```

Escanea el código QR con Expo Go o abre un emulador (`a` para Android, `i` para iOS en macOS).

La URL de la API se resuelve en `mobile/config.js`. Por defecto toma la IP del servidor de desarrollo de Expo y apunta al puerto `8000`. En un emulador funciona contra el backend en loopback; en un dispositivo físico con Expo Go el backend debe escuchar en la red local (`php -S 0.0.0.0:8000 -t public`) para que el teléfono pueda alcanzarlo. Si necesitas fijar otra dirección, edita `API_URL` en ese archivo.

Si prefieres React Native CLI en lugar de Expo, el código de `App.js` y `config.js` es reutilizable: crea un proyecto con `npx @react-native-community/cli init`, copia esos archivos y añade `expo-constants` (o reemplaza la resolución de `API_URL` por la IP de tu backend).

## Endpoints

### GET /api/books

Devuelve la lista de libros con el promedio de calificación calculado en una sola consulta con `AVG()` y `GROUP BY`.

```bash
curl http://127.0.0.1:8000/api/books
```

```json
[
  {
    "id": 1,
    "title": "El Arte de Programar",
    "author": "Donald Knuth",
    "published_year": 1968,
    "average_rating": 4
  },
  {
    "id": 2,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "published_year": 2008,
    "average_rating": 3.5
  },
  {
    "id": 3,
    "title": "Refactoring",
    "author": "Martin Fowler",
    "published_year": 1999,
    "average_rating": 2.5
  }
]
```

Además de los campos que pide el enunciado (title, author, published_year, average_rating) se incluye `id`, que los frontends usan para crear reseñas. El promedio se redondea a un decimal. Un libro sin reseñas devuelve `average_rating: null`. La decisión fue usar `null` en lugar de `0` para distinguir un libro sin calificaciones de uno calificado con el mínimo posible.

### GET /api/books/{id}

Devuelve un libro con su promedio, el número de reseñas y la lista completa de reseñas (más recientes primero). Lo usan los frontends para la pantalla de detalle.

```bash
curl http://127.0.0.1:8000/api/books/1
```

```json
{
  "id": 1,
  "title": "El Arte de Programar",
  "author": "Donald Knuth",
  "published_year": 1968,
  "average_rating": 4,
  "review_count": 3,
  "reviews": [
    { "id": 3, "rating": 3, "comment": "Valioso, aunque cuesta seguir el ritmo.", "created_at": "2026-07-24T22:19:25+00:00" },
    { "id": 2, "rating": 4, "comment": "Exigente pero muy completo en fundamentos.", "created_at": "2026-07-24T22:19:25+00:00" },
    { "id": 1, "rating": 5, "comment": "Una obra de referencia, densa pero imprescindible.", "created_at": "2026-07-24T22:19:25+00:00" }
  ]
}
```

Si el libro no existe devuelve `404` con `{ "errors": [{ "field": null, "message": "Book not found" }] }`.

### POST /api/reviews

Registra una reseña para un libro.

```bash
curl -X POST http://127.0.0.1:8000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"book_id": 1, "rating": 5, "comment": "Excelente libro"}'
```

Respuesta `201 Created`:

```json
{
  "id": 8,
  "book_id": 1,
  "rating": 5,
  "comment": "Excelente libro",
  "created_at": "2026-07-24T23:03:33+00:00"
}
```

### DELETE /api/reviews/{id}

Elimina una reseña. Responde `204 No Content` si se borró, o `404` si la reseña no existe.

```bash
curl -X DELETE http://127.0.0.1:8000/api/reviews/8
```

### Respuestas ante errores de validación

Todas las validaciones fallidas devuelven `400 Bad Request` con la lista de errores:

```json
{
  "errors": [
    { "field": "rating", "message": "rating must be between 1 and 5" }
  ]
}
```

| Caso | Status | Mensaje |
| --- | --- | --- |
| `rating` fuera de 1..5 | 400 | rating must be between 1 and 5 |
| `book_id` inexistente | 400 | Book not found |
| `comment` vacío | 400 | comment must not be empty |
| Campo requerido ausente | 400 | book_id is required / rating is required |
| Cuerpo JSON inválido | 400 | Invalid request body |

## Decisiones técnicas

- El promedio se calcula con una única consulta (`QueryBuilder` con `LEFT JOIN`, `AVG(rating)` y `GROUP BY`) en `BookRepository::findAllWithAverageRating`, evitando el problema N+1.
- Las respuestas públicas se arman con DTOs (`BookListItem`, `BookDetail`, `ReviewItem`, `ReviewResponse`) en lugar de exponer las entidades.
- El JSON usa snake_case (`published_year`, `average_rating`, `book_id`, `created_at`) mediante un name converter del serializer.
- CORS habilitado con NelmioCorsBundle para permitir el consumo desde los frontends durante la evaluación.
- Toda la API vive bajo el prefijo `/api` y responde JSON de forma consistente.

## Escalabilidad

¿Qué cambiaría para escalar esta app a cientos de miles de libros y usuarios?

El primer cuello de botella sería recalcular `average_rating` en cada lectura. Lo denormalizaría: guardar en la tabla `book` las columnas `rating_sum` y `rating_count`, actualizadas de forma transaccional al crear o eliminar una reseña. Así `GET /api/books` se vuelve una lectura directa sin agregaciones. Para rankings o listados globales, una vista materializada refrescada de forma periódica es otra opción válida.

`GET /api/books` necesita paginación (cursor sobre `id` o keyset) en vez de devolver todo el catálogo, más índices en las columnas de filtrado y orden. Las respuestas de listado, al cambiar poco, se cachean en Redis con invalidación al escribir una reseña, y detrás de un CDN o cache HTTP con ETag.

En infraestructura separaría lecturas y escrituras con réplicas de PostgreSQL, apuntando los `GET` a las réplicas. Ante un volumen muy alto de reseñas, moverlas a una escritura asíncrona por cola desacopla el POST del cálculo de agregados.

Sumaría paginación en los clientes, rate limiting, autenticación por token para las escrituras, observabilidad (métricas y trazas) y tests de carga sobre los endpoints de listado, que son los más consultados.

## Video

Videos de la web (Vue) y la app móvil (React Native) funcionando:

https://drive.google.com/drive/folders/1ORr_93j1e_OSZUALrUxzZnuNnt66ghp8?usp=drive_link

## Entrega

- Branch evaluado: `main`
- Commit final: el último commit publicado en `main` (se obtiene con `git log -1 --format=%H`)
