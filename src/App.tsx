import { useEffect } from "react";
import { MovieList } from "./components/MovieList";
import { Navbar } from "./components/Navbar";
import { useAppDispatch } from "./app/hooks";
import {
  loadMoviesFromLocalStorage,
  setToken,
} from "./features/getMoviesSlice";
import { getToken } from "./services/auth";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        dispatch(setToken(token));
        localStorage.setItem("authToken", token);

        dispatch(loadMoviesFromLocalStorage());
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <div className="app">
      <Navbar />
      <MovieList />
    </div>
  );
}

export default App;
