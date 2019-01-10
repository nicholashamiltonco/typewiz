let words = require('./words');

module.exports = {
  matchWord: function (currentWord, clientWord) {
    if (currentWord === clientWord) {
      return true;
    }
    return false;
  },
  // pass difficulty in params for various levels   function(level) => words.level  
  randomWord: function () {
    // Generate random array index 
    let randIndex = Math.floor(Math.random() * words.easy.length);
    return words.easy[randIndex];
  }
  // totalWpm: function(totalSeconds, timesPlayed) {
  //   let wpm = (totalSeconds / timesPlayed) * 60;
  //   return wpm;
  // },
  // totalLinesOfCode: function(scoreToDate) {
  //   let totalLinesOfCode = scoreToDate;
  //   return totalLinesOfCode;
  // }
};

