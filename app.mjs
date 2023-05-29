import { createInterface } from 'readline';
import { displayMovieCatalog, addNewMovie, updateMovieDetails, deleteMovie, searchAndFilter, fetchMovieData } from './movieManager.mjs';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('=== Movie Catalog Menu ===');
  console.log('1. Display Movie Catalog');
  console.log('2. Add New Movie');
  console.log('3. Update Movie Details');
  console.log('4. Delete Movie');
  console.log('5. Search and Filter');
  console.log('6. Fetch Movie Data');
  console.log('0. Exit');
  console.log('=========================');
}

function startApp() {
  displayMenu();

  rl.question('Enter your choice: ', async (choice) => {
    switch (choice) {
      case '1':
        await displayMovieCatalog();
        break;
      case '2':
        await addNewMovie(rl);
        break;
      case '3':
        await updateMovieDetails(rl);
        break;
      case '4':
        await deleteMovie(rl);
        break;
      case '5':
        await searchAndFilter(rl);
        break;
      case '6':
        await fetchMovieData(rl);
        break;
      case '0':
        rl.close();
        break;
      default:
        console.log('Invalid choice.');
        break;
    }

    if (choice !== '0') {
      startApp();
    }
  });
}

startApp();
