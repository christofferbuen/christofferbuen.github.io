/**
 * RETRO TERMINAL - CUSTOM SOUND SETUP
 * 
 * To add custom keyboard sounds, create a script that runs after retro-terminal.js
 * or add this code to your HTML file.
 * 
 * EXAMPLE SETUP:
 */

// Wait for the terminal to be initialized
document.addEventListener('DOMContentLoaded', async () => {
  // Get reference to terminal instance
  // You may need to expose it globally or store it
  
  // Example of how to configure sounds:
  /*
  
  // Set individual sound paths
  terminal.setSoundPath('spacebar', 'sounds/spacebar.mp3');
  terminal.setSoundPath('enter', 'sounds/enter.mp3');
  terminal.setSoundPath('backspace', 'sounds/backspace.mp3');
  terminal.setSoundPath('tab', 'sounds/tab.mp3');
  
  // Set 5 random typing sounds (indices 0-4)
  terminal.setSoundPath('typing', 'sounds/type1.mp3', 0);
  terminal.setSoundPath('typing', 'sounds/type2.mp3', 1);
  terminal.setSoundPath('typing', 'sounds/type3.mp3', 2);
  terminal.setSoundPath('typing', 'sounds/type4.mp3', 3);
  terminal.setSoundPath('typing', 'sounds/type5.mp3', 4);
  
  // Reload the sounds after setting all paths
  await terminal.reloadSounds();
  
  */
});