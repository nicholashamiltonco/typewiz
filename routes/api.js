var express = require('express');
var router = express.Router();
var PlayerStats = require('../models/Stats');

// get high scores 
router.get('/stats', function (req, res) {
  PlayerStats.find({}).sort({highScore: 'desc'}).exec(function(err, stats) {
    if (!err) {
      res.json(stats);
    }
  });
});

// get high scores 
router.get('/userstats', ensureAuthenticated, function (req, res) {
  let query  = PlayerStats.where({ username: 'markofj'});
  query.findOne(function (err, stats) {
    if (err) return handleError(err);
    if (stats) {
      res.json(stats);
    }
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