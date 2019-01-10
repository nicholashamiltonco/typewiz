const syntax = [
  'let greeting = "hello world"'
];


function validateChange() {
  prevHighScore = highScore;
  highScore = score;
  if (prevHighScore + 1 != highScore) {
    return false;
  }
  return true;
}