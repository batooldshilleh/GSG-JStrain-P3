
import fs from 'fs';
import fetch from 'node-fetch';


//const fs = require('fs');
//const fetch = require('node-fetch');


const movieCatalogFile = 'movie-catalog.json';

export function loadMovieCatalog() {
  try {
    const movieCatalogData = fs.readFileSync(movieCatalogFile, 'utf8');
    return JSON.parse(movieCatalogData);
  } catch (error) {
    console.log('An error occurred while loading the movie catalog.');
    console.log(error);
    return [];
  }
}

export function saveMovieCatalog(movieCatalog) {
  try {
    fs.writeFileSync(movieCatalogFile, JSON.stringify(movieCatalog, null, 2));
  } catch (error) {
    console.log('An error occurred while saving the movie catalog.');
    console.log(error);
  }
}

export async function displayMovieCatalog() {
  const movieCatalog = loadMovieCatalog();
  console.log('=== Movie Catalog ===');
  movieCatalog.forEach((movie, index) => {
    console.log(`${index + 1}. ${movie.title} (${movie.releaseYear}) - ${movie.director} (${movie.genre})`);
  });
  console.log('====================');
}

export async function addNewMovie(rl) {
  rl.question('Enter movie title: ', (title) => {
    rl.question('Enter movie director: ', (director) => {
      rl.question('Enter movie release year: ', (releaseYear) => {
        rl.question('Enter movie genre: ', (genre) => {
          const movie = {
            title,
            director,
            releaseYear,
            genre
          };
          const movieCatalog = loadMovieCatalog();
          movieCatalog.push(movie);
          saveMovieCatalog(movieCatalog);
          console.log('Movie added successfully.');
          rl.close();
        });
      });
    });
  });
}

export async function updateMovieDetails(rl) {
  const movieCatalog = loadMovieCatalog();
  displayMovieCatalog();
  rl.question('Enter the number of the movie to update: ', (movieIndex) => {
    const index = parseInt(movieIndex, 10) - 1;
    if (index >= 0 && index < movieCatalog.length) {
      const movie = movieCatalog[index];
      rl.question('Enter updated movie title: ', (title) => {
        movie.title = title;
        rl.question('Enter updated movie director: ', (director) => {
          movie.director = director;
          rl.question('Enter updated movie release year: ', (releaseYear) => {
            movie.releaseYear = releaseYear;
            rl.question('Enter updated movie genre: ', (genre) => {
              movie.genre = genre;
              saveMovieCatalog(movieCatalog);
              console.log('Movie details updated successfully.');
              rl.close();
            });
          });
        });
      });
    } else {
      console.log('Invalid movie number.');
      rl.close();
    }
  });
}

export async function deleteMovie(rl) {
  const movieCatalog = loadMovieCatalog();
  displayMovieCatalog();
  rl.question('Enter the number of the movie to delete: ', (movieIndex) => {
    const index = parseInt(movieIndex, 10) - 1;
    if (index >= 0 && index < movieCatalog.length) {
      movieCatalog.splice(index, 1);
      saveMovieCatalog(movieCatalog);
      console.log('Movie deleted successfully.');
    } else {
      console.log('Invalid movie number.');
    }
    rl.close();
  });
}

export async function searchAndFilter(rl) {
  rl.question('Enter search keyword: ', (keyword) => {
    const movieCatalog = loadMovieCatalog();
    const searchResults = movieCatalog.filter(movie => {
      const { title, director, genre } = movie;
      return (
        title.toLowerCase().includes(keyword.toLowerCase()) ||
        director.toLowerCase().includes(keyword.toLowerCase()) ||
        genre.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    console.log('=== Search Results ===');
    searchResults.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear}) - ${movie.director} (${movie.genre})`);
    });
    console.log('====================');
    rl.close();
  });
}

export async function fetchMovieData(rl) {
  rl.question('Enter movie title to search: ', async (title) => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=YOUR_API_KEY`);
      const data = await response.json();
      if (data.Response === 'True') {
        const movie = {
          title: data.Title,
          director: data.Director,
          releaseYear: data.Year,
          genre: data.Genre
        };
        const movieCatalog = loadMovieCatalog();
        movieCatalog.push(movie);
        saveMovieCatalog(movieCatalog);
        console.log('Movie data fetched and added to the catalog.');
      } else {
        console.log('Movie not found.');
      }
    } catch (error) {
      console.log('An error occurred while fetching movie data.');
      console.log(error);
    }
    rl.close();
  });
}

const movieManager = {
  displayMovieCatalog,
  addNewMovie,
  updateMovieDetails,
  deleteMovie,
  searchAndFilter,
  fetchMovieData
};
export default movieManager;