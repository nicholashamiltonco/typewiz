var mongoose = require('mongoose');

// Stats Schema
var StatsSchema = mongoose.Schema({
  currentWord: {
    type: String
  },
  currentScore: {
    type: Number
  },
  highScore: {
    type: Number
  },
  scoreToDate: {
    type: Number
  },
  timesPlayed: {
    type: Number
  },
  avgScore: {
    type: Number
  },
  date: { type: Date, default: Date.now },
  totalSeconds: {
    type: Number
  },
  wordsPerMin: {
    type: Number
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  username: String
});

var PlayerStats = module.exports = mongoose.model('PlayerStats', StatsSchema);

module.exports.updateHighScore = function(newHighScore, callback){
  newHighScore.save(callback);
}




