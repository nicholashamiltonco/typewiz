const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3333/stats' : 'https://typewiz-api.now.sh/stats';
window.addEventListener('load', init);

// Database DOM Elements
let highScoreMongo = document.querySelector('td#highScore');
let currentWordMongo = document.querySelector('h2#current-word');
currentWordMongo.innerText = '';
let currentScoreMongo = document.querySelector('input#current-score');
let averageScoreMongo = document.querySelector('td#average-score');

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const correctAnsw = document.getElementById('correct');
const timerBar = document.querySelector('#timerStatus2');

// Game Variables 
let currentLevel;
let time = 0;
let transitionSeconds = 0;
let score = 0;
let isPlaying;

// Available Levels
const levels = {
  superEasy: 10,
  easy: 5,
  medium: 3,
  hard: 2,
  extraHard: 1.5,
  impossible: 1
};

// Initialize Game
function init() {
  // Initialize stats to server
  sendStats('INITIALLOAD');
  // Focus word input 
  wordInput.focus();
  // Start matching on word input
  wordInput.addEventListener('input', function() {
    startMatch();
  });
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check game status
  setInterval(checkStatus, 50);
}

// Start match
function startMatch() {
  // Set time to current level
  setTimeout(function() {
    time = currentLevel + 1;
    updateTimeBar();
  }, 20);
  // Conditional if matchWords returns true
  if (matchWords()) {
    isPlaying = true;
    clientWord = wordInput.value.toLowerCase();
    // Send stats on match 
    sendStats(clientWord);
    // Refresh timer bar
    setTimeout(function() {
      time = currentLevel + 1;
      updateTimeBar();
    }, 20);
    // Reset word input 
    wordInput.value = '';  
  }
                           
  // difficulty increase                - clean up later to server
  if (score <= 5) {
    currentLevel = levels.easy;
  } else if (score > 5 || score <= 10) {
    currentLevel = levels.medium;
  } else if (score > 10) {
    currentLevel = levels.hard;
  } else if (score > 15) {
    currentLevel = levels.extraHard;
  } else if (score > 20) {
    currentLevel = levels.impossible;
  }
}


// Match currentWord to wordInput
function matchWords() {
  if ((wordInput.value).toLowerCase() === currentWord.innerText) {
    // Play correct answer mp3
    setTimeout(function() {
      correctAnsw.play();
    }, 1);
    // Reset timer bar
    setTimeout(function() {
      resetTimerBar();
    }, 5);
    return true;
  } else {
    return false;
  }
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    if (isPlaying) {
      // Reset game
      sendStats('RESET');
    }
    // Game is over
    isPlaying = false;
  }
}

// Check game status
function checkStatus() {
  if (!isPlaying && time === 0) {
    resetTimerBar();
    score = 0;
  }
}

// Reset timerbar to 100%
function resetTimerBar() {
  timerBar.style.transitionDuration = '0s';
  timerBar.style.width = '100%';
  timerBar.style.backgroundColor = '#71EC3F';
}

// Start timerbar countdown
function updateTimeBar() {
  transitionSeconds = time;
  timerBar.style.transitionDuration = (transitionSeconds + 2) + 's';
  timerBar.style.width = '0px';
  timerBar.style.backgroundColor = '#AD310B';
}

// Send stats to server
function sendStats(currentWord) {
  currentWordMongo.innerText = '';
  const stats = { currentWord: currentWord }
  // POST payload to server
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(stats),
    headers: {
      'content-type': 'application/json'
    }
  })
  // GET new data from server
  .then(res => res.json())
  .then(response => {
    console.log(JSON.stringify(response));
    // Render new data to DOM
    renderRes(response);
  })
  .catch(error => console.error('Error:', error));
  // Reset timerbar
  updateTimeBar();
}

// Render JSON to DOM
function renderRes(response) {
  highScoreMongo.innerText = JSON.stringify(response.highScore);
  currentWordMongo.innerText = JSON.stringify(response.currentWord).replace(/\"/g, "");
  currentScoreMongo.value = JSON.stringify(response.currentScore);
  averageScoreMongo.innerText = JSON.stringify(response.avgScore);
}










