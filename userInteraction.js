// userInteraction.js
const readline = require('readline-sync');
const { displayMovies, addMovie, updateMovie, deleteMovie, searchMovies, filterMovies } = require('/home/batool/Documents/proj3/movieManagement.js');

// Display the main menu
function displayMenu() {
  console.log('====== Movie Catalog CLI ======');
  console.log('1. Display Movie Catalog');
  console.log('2. Add New Movie');
  console.log('3. Update Movie Details');
  console.log('4. Delete Movie');
  console.log('5. Search Movies');
  console.log('6. Filter Movies');
  console.log('exit - Exit the application');
  console.log('==============================');
}

// Get user's choice
function getUserChoice() {
  return readline.question('Enter your choice: ');
}

// Perform the selected action based on user's choice
async function performAction(choice) {
  switch (choice) {
    case '1':
      displayMovies();
      break;
    case '2':
      await addMovie();
      break;
    case '3':
      await updateMovie();
      break;
    case '4':
      await deleteMovie();
      break;
    case '5':
      searchMovies();
      break;
    case '6':
      filterMovies();
      break;
    default:
      console.log('Invalid choice. Please try again.');
  }
}

module.exports = { displayMenu, getUserChoice, performAction };
