// index.js
const { displayMenu, performAction } = require('/home/batool/Documents/proj3/userInteraction.js');

// Start the application
function startApp() {
  displayMenu();
  const choice = getUserChoice();

  if (choice === 'exit') {
    console.log('Exiting the application...');
    return;
  }

  performAction(choice)
    .then(() => {
      startApp();
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      startApp();
    });
}

startApp();
