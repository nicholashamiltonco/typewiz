let express = require('express');
let router = express.Router();
let PlayerStats = require('../models/Stats');
let GameService = require('../controller/GameService');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
  let query  = PlayerStats.where({ username: req.user.username});
  query.findOne(function (err, stats) {
    if (err) return handleError(err);
    if (stats) {
      stats.currentScore = 0; 
      stats.avgScore = stats.avgScore.toFixed(2);
      res.render('index', {
        title: 'Typewiz', stats: stats
      });
    } else {
      let newStats = new PlayerStats({
        highScore: 0, currentScore: 0, scoreToDate: 0, timesPlayed: 0, avgScore: 0, totalSeconds: 0,
        currentWord: GameService.randomWord(),
        playerId: req.user._id,
        username: req.user.username
      });
      PlayerStats.create(newStats, function(err, stats) {
        res.render('index', {
          title: 'Typewiz', stats: stats
        });
      });
    }
  });
});

router.get('/stats', function(req, res) {
  PlayerStats.find({}).sort({highScore: 'desc'}).exec(function(err, stats) {
    if (!err) {
      stats.forEach(stat => {
        stat.avgScore = stat.avgScore.toFixed(2);
      });
      res.render('stats', {
        title: 'Typewiz Stats', stats
      });
    }
  });
})

// Post stats
router.post('/stats', ensureAuthenticated, function (req, res) {
  // User variables
  let player = req.user._id;
  let username = req.user.username;
  // Client word submission
  let clientWord = req.body.currentWord;
  // Find Users stats
  let query  = PlayerStats.where({ username: req.user.username});
  query.findOne(function (err, stats) {
    if (err) return handleError(err);
    if (stats) {
      // Query variables
      let currentWord = stats.currentWord;
      let currentScore = stats.currentScore;
      let scoreToDate = stats.scoreToDate;
      let timesPlayed = stats.timesPlayed;
      let highScore = stats.highScore;
      //                                          Refactor/ update later bellow
      // let totalSeconds = stats.totalSeconds;
      // let wordPerMin;
      // wordPerMin = (totalSeconds / scoreToDate) * 60;   
      // Ensure words match
      console.log(currentWord + ' ' + clientWord);
      // If GameService.matchWord() returns true 
      if (GameService.matchWord(currentWord, clientWord)) {
        console.log(currentScore);
        // Increment currentScore and scoreToDate
        currentScore = currentScore + 1;
        scoreToDate = scoreToDate + 1;
        // Update highScore if currentScore > highScore
        if (currentScore > highScore) {
          highScore = currentScore;
        }
      } else {
        // If GameService.matchWord() returns false 
        if (clientWord === 'RESET') {
          // Increment timesplayed and reset currentScore
          timesPlayed = timesPlayed + 1;
          currentScore = 0;
        } else if (clientWord === 'INITIALLOAD') {
          currentScore = 0;
        }
      }
      // Logic for average score 
      let avgScore;
      if (timesPlayed > 0) {
        avgScore = (scoreToDate / timesPlayed);
      } else {
        avgScore = 0;
      }
      // let difficulty = '';
      // currentScore < 50 ? difficulty = 'easy' : difficulty = 'hard';
      // Generate new word before updating db
      generateWord = GameService.randomWord();
      // Prepare stats for Database
      let newGameStats = new PlayerStats({
        highScore: highScore,
        currentScore: currentScore,
        currentWord: generateWord,
        scoreToDate: scoreToDate,
        timesPlayed: timesPlayed,
        avgScore: avgScore,
        player: player,
        username: username
      });
      // convert model instance to a simple object using models 'toObject function'
      let upsetData = newGameStats.toObject();
      // Delete _id property, otherwise Mongo will return "mod not allowed"
      delete upsetData._id;
      // Set condition for findOneAndUpdate()
      let condition = { playerId : req.user._id }
      // Update PlayerStats
      PlayerStats.findOneAndUpdate(condition, upsetData, {upsert:true}, function(err, doc) {
        if (err) throw err;
        console.log('Stats updated');
        // Retrieve and send stats back
        let query  = PlayerStats.where(condition);
        query.findOne(function (err, stats) { 
          if (!err) {
            stats.avgScore = stats.avgScore.toFixed(2);
            res.json(stats);
          }
        });
      })
    };
  });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;	