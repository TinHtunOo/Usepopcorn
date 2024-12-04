import { useEffect, useRef, useState } from "react";
import RisingStar from "./RisingStar";
import { useGetMovie } from "./useGetMovies";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const apiKey = "fcfdcda";

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const [watched, setWatched] = useState(function () {
    const watchedMovieList = localStorage.getItem("watched");
    return JSON.parse(watchedMovieList);
  });

  const starRate = watched?.some((movie) => movie.imdbID === selected)
    ? watched.filter((movie) => movie.imdbID === selected).at(0).userRating
    : 0;

  const { movies, isLoading, error } = useGetMovie(query);

  function handleAddMovie(id) {
    setSelected((selected) => (selected === id ? null : id));
  }

  function handleCloseMovie() {
    setSelected(null);
  }

  function handleAddWatchedMovie(newMovie) {
    setWatched((watched) =>
      watched.some((movie) => movie.imdbID === newMovie.imdbID)
        ? watched
        : [...watched, newMovie]
    );
  }

  function handleDelete(id) {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <MovieNumber movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onClick={handleAddMovie}
              selected={selected}
            />
          )}
          {error && <Error error={error} />}
        </Box>
        <Box>
          {selected ? (
            <MovieDetail
              selected={selected}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              starRate={starRate}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList watched={watched} onDelete={handleDelete} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Error({ error }) {
  return <p className="error">{error}</p>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Enter") {
          // console.log(document.activeElement);
          // console.log(inputEl.current);
          if (document.activeElement === inputEl.current) return;
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callBack);
      return () => {
        document.removeEventListener("keydown", callBack);
      };
    },
    [setQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function MovieNumber({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onClick={onClick} />
      ))}
    </ul>
  );
}

function Movie({ movie, onClick }) {
  return (
    <li key={movie.imdbID} onClick={() => onClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetail({ selected, onCloseMovie, onAddWatchedMovie, starRate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [movieInfo, setMovieInfo] = useState({});
  const [userRating, setUserRating] = useState("");
  const ratingCount = useRef(0);
  useEffect(
    function () {
      if (userRating) ratingCount.current++;
    },
    [userRating]
  );

  const {
    Title: title,
    Released: released,
    Poster: poster,
    Plot: plot,
    imdbRating,
    Runtime: runtime,
    Genre: genre,
    Actors: actors,
    Director: director,
    imdbID,
  } = movieInfo;

  function addToWatched() {
    const newMovie = {
      imdbID,
      imdbRating,
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      poster,
      title,
      userDecisionCount: ratingCount.current,
    };
    onAddWatchedMovie(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function fetchSelectedMovie() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${selected}`
        );
        const data = await res.json();
        setMovieInfo(data);
        setIsLoading(false);
      }
      fetchSelectedMovie();
    },
    [selected]
  );

  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callBack);
      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!starRate ? (
                <>
                  <RisingStar
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating && (
                    <button className="btn-add" onClick={addToWatched}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You have already rated the movie {starRate} ⭐️.</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating =
    Math.round(average(watched.map((movie) => movie.imdbRating)) * 10) / 10;
  const avgUserRating =
    Math.round(average(watched.map((movie) => movie.userRating)) * 10) / 10;
  const avgRuntime =
    Math.round(average(watched.map((movie) => movie.runtime)) * 10) / 10;
  const avgHour = Math.floor(avgRuntime / 60);
  const avgMin = Math.floor(avgRuntime % 60);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {avgHour ? `${avgHour} hr` : ""} {avgMin} min
          </span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onDelete={onDelete} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button onClick={() => onDelete(movie.imdbID)} className="btn-delete">
          X
        </button>
      </div>
    </li>
  );
}
