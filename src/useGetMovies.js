import { useEffect, useState } from "react";
const apiKey = "fcfdcda";

export function useGetMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchingMovieData() {
        setError("");
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("There is a problem with fetching.");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error("The movie is not found.");
          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 2) {
        setError("");
        setMovies([]);
        return;
      }
      //   handleCloseMovie();
      fetchingMovieData();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
