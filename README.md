# Movie List

This is a web application designed to store, view, add, delete, and import movies from a text file. The application allows you to search for movies by title or actor, and also sort the list of movies alphabetically.

## Project architecture

```plaintext
public/
  images/
  index.html

src/
  api/
    moviesApi.ts

  app/
    hooks.ts
    store.ts

  components/

  features/
    getMoviesSlice.ts
    selectors.ts

  types/
    Movie.ts
    Status.ts
    UploadedFile.ts

  utils/
    api.ts
    parseMoviesFromText.ts

  App.tsx
  main.tsx
```

## Technologies

- TypeScript
- React
- Redux

## Setup Instructions

To run the app using Docker, make sure the backend API is available at http://localhost:8000/api/v1.

Then execute the following command:

```bash
docker run --name movies-frontend -p 3000:3000 -e VITE_API_URL=http://localhost:8000/api/v1 marusya1/movies-frontend

```

- Open http://localhost:3000 in your browser.
