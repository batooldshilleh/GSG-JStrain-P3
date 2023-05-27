// movieManagement.js
const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline-sync');

const MOVIE_API_URL = 'https://api.example.com/movies';
const MOVIE_FILE_PATH = 'movies.json';

// Read movie data from JSON file
function readMovies() {
  try {
    const moviesData = fs.readFileSync(MOVIE_FILE_PATH);
    return JSON.parse(moviesData);
  } catch (error) {
    console.error('Error reading movies data:', error);
    return [];
  }
}

// Write movie data to JSON file
function writeMovies(movies) {
  try {
    fs.writeFileSync(MOVIE_FILE_PATH, JSON.stringify(movies, null, 2));
    console.log('Movie catalog updated successfully!');
  } catch (error) {
    console.error('Error writing movies data:', error);
  }
}

// Display movie catalog
function displayMovies() {
  const movies = readMovies();

  if (movies.length === 0) {
    console.log('The movie catalog is empty.');
  } else {
    console.log('Movie Catalog:');
    console.table(movies);
  }
}

// Add a new movie to the catalog
async function addMovie() {
  const title = readline.question('Enter the movie title: ');
  const director = readline.question('Enter the movie director: ');
  const releaseYear = readline.question('Enter the movie release year: ');
  const genre = readline.question('Enter the movie genre: ');

  // Fetch additional movie data from API
  const movieData = await fetchMovieData(title);

  const newMovie = {
    title,
    director,
    releaseYear,
    genre,
    plot: movieData.plot,
    ratings: movieData.ratings,
    poster: movieData.poster,
  };

  const movies = readMovies();
  movies.push(newMovie);
  writeMovies(movies);
}

// Update movie details
async function updateMovie() {
  const movies = readMovies();
  if (movies.length === 0) {
    console.log('The movie catalog is empty.');
    return;
  }

  console.log('Select a movie to update:');
  displayMovies();
  const movieIndex = readline.questionInt('Enter the index of the movie to update: ');

  if (movieIndex < 0 || movieIndex >= movies.length) {
    console.log('Invalid movie index.');
    return;
  }

  const movie = movies[movieIndex];
  console.log('Current Movie Details:');
  console.table(movie);

  const title = readline.question('Enter the new movie title (or press Enter to skip): ');
  const director = readline.question('Enter the new movie director (or press Enter to skip): ');
  const releaseYear = readline.question('Enter the new movie release year (or press Enter to skip): ');
  const genre = readline.question('Enter the new movie genre (or press Enter to skip): ');

  if (title) movie.title = title;
  if (director) movie.director = director;
  if (releaseYear) movie.releaseYear = releaseYear;
  if (genre) movie.genre = genre;

  // Fetch additional movie data from API
  const movieData = await fetchMovieData(movie.title);
  movie.plot = movieData.plot;
  movie.ratings = movieData.ratings;
  movie.poster = movieData.poster;

  writeMovies(movies);
}

// Delete a movie from the catalog
async function deleteMovie() {
  const movies = readMovies();
  if (movies.length === 0) {
    console.log('The movie catalog is empty.');
    return;
  }

  console.log('Select a movie to delete:');
  displayMovies();
  const movieIndex = readline.questionInt('Enter the index of the movie to delete: ');

  if (movieIndex < 0 || movieIndex >= movies.length) {
    console.log('Invalid movie index.');
    return;
  }

  movies.splice(movieIndex, 1);
  writeMovies(movies);
}

// Search movies by title, director, or genre
function searchMovies() {
  const movies = readMovies();
  if (movies.length === 0) {
    console.log('The movie catalog is empty.');
    return;
  }

  const query = readline.question('Enter the search query: ');

  const matchedMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.director.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.toLowerCase().includes(query.toLowerCase())
  );

  if (matchedMovies.length === 0) {
    console.log('No movies found.');
  } else {
    console.log('Search Results:');
    console.table(matchedMovies);
  }
}

// Filter movies by genre or release year
function filterMovies() {
  const movies = readMovies();
  if (movies.length === 0) {
    console.log('The movie catalog is empty.');
    return;
  }

  console.log('Select a filter option:');
  console.log('1. Filter by genre');
  console.log('2. Filter by release year');
  const filterOption = readline.question('Enter your choice: ');

  let filteredMovies;

  switch (filterOption) {
    case '1':
      const genre = readline.question('Enter the genre to filter by: ');
      filteredMovies = movies.filter((movie) => movie.genre.toLowerCase() === genre.toLowerCase());
      break;
    case '2':
      const releaseYear = readline.question('Enter the release year to filter by: ');
      filteredMovies = movies.filter((movie) => movie.releaseYear === releaseYear);
      break;
    default:
      console.log('Invalid filter option.');
      return;
  }

  if (filteredMovies.length === 0) {
    console.log('No movies found.');
  } else {
    console.log('Filtered Results:');
    console.table(filteredMovies);
  }
}

// Fetch additional movie data from API
async function fetchMovieData(title) {
  const apiUrl = `${MOVIE_API_URL}?title=${encodeURIComponent(title)}`;

  try {
    const response = await fetch(apiUrl);
    const movieData = await response.json();
    return movieData;
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return {};
  }
}

module.exports = {
  displayMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  filterMovies,
};
