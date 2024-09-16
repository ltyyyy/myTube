// Get the flash message element
const flashMessage = document.getElementById('showFlashMessage');

// Show the flash message
flashMessage.style.display = 'block';

// Add the 'hide' class after 3 seconds to trigger fade-out
setTimeout(() => {
  flashMessage.classList.add('hide');
}, 3000);

// Remove the flash message from the DOM after fade-out completes
setTimeout(() => {
  flashMessage.style.display = 'none';
}, 3500);
