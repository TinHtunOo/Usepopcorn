import { useState } from "react";

export function useStorageSpace(initialState, key) {
  const [watched, setWatched] = useState(function () {
    const watchedMovieList = localStorage.getItem(key);

    return watchedMovieList ? JSON.parse(watchedMovieList) : initialState;
  });
  return { watched, setWatched };
}
