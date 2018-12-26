var fs = require('fs');
let snakeHighscores;

// Populates default score data, call this function to reset scores
exports.init = function(){
  let snakeHighscores = { easy:   {names: ['Empty', 'Empty', 'Empty'], scores: [0, 0, 0]},
                          medium: {names: ['Empty', 'Empty', 'Empty'], scores: [0, 0, 0]},
                          hard:   {names: ['Empty', 'Empty', 'Empty'], scores: [0, 0, 0]}};
  let snakeHighscoresJSON = JSON.stringify(snakeHighscores);
  fs.writeFile('./public/files/snakeHighscores.txt', snakeHighscoresJSON, function(err, data){
    if(err){ console.log('ERROR: ' + JSON.stringify(err)); }
    else{ console.log('SAVED!'); }
  });
}

// Determines whether player's score is within the top 3
exports.determineHighscore = function(req, res){
  console.log('determineHighscore');
  let score = req.body.score;
  let difficulty = req.body.difficulty;
  let highscorePos = 6;

  // Read in text file and determine if player beat any of the highscores
  fs.readFile('./public/files/snakeHighscores.txt', function(err, data){
    if(err){throw err;}
    snakeHighscores = JSON.parse(data);
    for(let i in snakeHighscores){
      if(difficulty == i){
        for(let j = 4; j >= 0; j--){
          if(score > snakeHighscores[difficulty]['scores'][j]){
            highscorePos = j;
          }
        }
      }
    }

    // If they have a position within the highscores, indicate they have newHighscore and return necessary data
    if(highscorePos < 6){
      let responseObj = {highscores: snakeHighscores, newHighscore: 'true', difficulty: difficulty, highscorePos: highscorePos};
      res.send(responseObj);
    }
    else{
      let responseObj = {highscores: snakeHighscores, newHighscore: 'false'};
      res.send(responseObj);
    }
  });
}

// Place new highschool into highscores object and write to file
exports.setHighscore = function(req, res){
  console.log('setHighscore');
  let difficulty = req.body.difficulty;
  let highscorePos = req.body.highscorePos;
  let name = req.body.name;
  let score = parseInt(req.body.score);

  // Move existing highscores down and add new one
  for(let i = snakeHighscores[difficulty]['scores'].length - 1; i > highscorePos; i--){
    snakeHighscores[difficulty]['scores'][i] = snakeHighscores[difficulty]['scores'][i - 1];
    snakeHighscores[difficulty]['names'][i] = snakeHighscores[difficulty]['names'][i - 1];
  }
  snakeHighscores[difficulty]['names'][highscorePos] = name;
  snakeHighscores[difficulty]['scores'][highscorePos] = score;

  // Write the amended highscore object to text file
  let snakeHighscoresJSON = JSON.stringify(snakeHighscores);
  fs.writeFile('./public/files/snakeHighscores.txt', snakeHighscoresJSON, function(err, data){
    if(err){ console.log('ERROR: ' + JSON.stringify(err)); }
    res.sendStatus(200);
  });
}
