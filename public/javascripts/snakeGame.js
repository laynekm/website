let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let timer;
let difficulty;

//********************
//GAME MENU
//********************
$(document).ready(function(){
  initMenu();
});

function initMenu(){
  $("#canvas").mouseup(handleMouseUp);

  //erase canvas
   context.fillStyle = 'black';
   context.fillRect(0, 0, canvas.width, canvas.height);

   //set up formatting and colour
   context.font = '30pt Arial';
   context.textAlign = 'center';
   context.fillStyle = 'white';
   context.strokeStyle = 'white';
   context.fillText("SNAKE", canvas.width*(1/2), 75);

   //draw lines and labels
   context.font = '18pt Arial';
   context.fillRect(canvas.width*(1/3), 0, 1, canvas.height);
   context.fillRect(canvas.width*(2/3), 0, 1, canvas.height);
   context.fillText("Easy", canvas.width*(1/6), canvas.height*(1/3));
   context.fillText("Medium", canvas.width*(1/2), canvas.height*(1/3));
   context.fillText("Hard", canvas.width*(5/6), canvas.height*(1/3));

   //snakes are animated by creating square then just alternating colours between black and white
   let easySnake = [];
   easySnake.push({h: 8, w: 8, x: 83, y: 216, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 93, y: 216, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 103, y: 216, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 113, y: 216, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 123, y: 216, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 123, y: 226, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 123, y: 236, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 123, y: 246, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 123, y: 256, colour: 'white'});
   easySnake.push({h: 8, w: 8, x: 113, y: 256, colour: 'black'});
   easySnake.push({h: 8, w: 8, x: 103, y: 256, colour: 'black'});
   easySnake.push({h: 8, w: 8, x: 93, y: 256, colour: 'black'});
   easySnake.push({h: 8, w: 8, x: 83, y: 256, colour: 'black'});
   easySnake.push({h: 8, w: 8, x: 83, y: 246, colour: 'black'});
   easySnake.push({h: 8, w: 8, x: 83, y: 236, colour: 'black'});
   easySnake.push({h: 8, w: 8, x: 83, y: 226, colour: 'black'});

   let mediumSnake = [];
   mediumSnake.push({h: 8, w: 8, x: 296, y: 216, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 306, y: 216, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 316, y: 216, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 326, y: 216, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 336, y: 216, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 336, y: 226, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 336, y: 236, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 336, y: 246, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 336, y: 256, colour: 'white'});
   mediumSnake.push({h: 8, w: 8, x: 326, y: 256, colour: 'black'});
   mediumSnake.push({h: 8, w: 8, x: 316, y: 256, colour: 'black'});
   mediumSnake.push({h: 8, w: 8, x: 306, y: 256, colour: 'black'});
   mediumSnake.push({h: 8, w: 8, x: 296, y: 256, colour: 'black'});
   mediumSnake.push({h: 8, w: 8, x: 296, y: 246, colour: 'black'});
   mediumSnake.push({h: 8, w: 8, x: 296, y: 236, colour: 'black'});
   mediumSnake.push({h: 8, w: 8, x: 296, y: 226, colour: 'black'});

   let hardSnake = [];
   hardSnake.push({h: 8, w: 8, x: 517, y: 216, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 527, y: 216, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 537, y: 216, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 547, y: 216, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 557, y: 216, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 557, y: 226, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 557, y: 236, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 557, y: 246, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 557, y: 256, colour: 'white'});
   hardSnake.push({h: 8, w: 8, x: 547, y: 256, colour: 'black'});
   hardSnake.push({h: 8, w: 8, x: 537, y: 256, colour: 'black'});
   hardSnake.push({h: 8, w: 8, x: 527, y: 256, colour: 'black'});
   hardSnake.push({h: 8, w: 8, x: 517, y: 256, colour: 'black'});
   hardSnake.push({h: 8, w: 8, x: 517, y: 246, colour: 'black'});
   hardSnake.push({h: 8, w: 8, x: 517, y: 236, colour: 'black'});
   hardSnake.push({h: 8, w: 8, x: 517, y: 226, colour: 'black'});

   easyAnimationTimer = setInterval(easyAnimation, 125);
   mediumAnimationTimer = setInterval(mediumAnimation, 75);
   hardAnimationTimer = setInterval(hardAnimation, 50);

   function easyAnimation(){
     for(let i = 0; i < easySnake.length; i++){
       context.fillStyle = easySnake[i].colour;
       context.fillRect(easySnake[i].x, easySnake[i].y, easySnake[i].h, easySnake[i].w);
     }

     for(let i = easySnake.length-1; i > 0; i--){ easySnake[i].colour = easySnake[i-1].colour;}
     easySnake[0].colour = easySnake[easySnake.length-1].colour;
   }

   function mediumAnimation(){
     for(let i = 0; i < mediumSnake.length; i++){
       context.fillStyle = mediumSnake[i].colour;
       context.fillRect(mediumSnake[i].x, mediumSnake[i].y, mediumSnake[i].h, mediumSnake[i].w);
     }

     for(let i = mediumSnake.length-1; i > 0; i--){ mediumSnake[i].colour = mediumSnake[i-1].colour;}
     mediumSnake[0].colour = mediumSnake[mediumSnake.length-1].colour;
   }

   function hardAnimation(){
     for(let i = 0; i < hardSnake.length; i++){
       context.fillStyle = hardSnake[i].colour;
       context.fillRect(hardSnake[i].x, hardSnake[i].y, hardSnake[i].h, hardSnake[i].w);
     }

     for(let i = hardSnake.length-1; i > 0; i--){hardSnake[i].colour = hardSnake[i-1].colour;}
     hardSnake[0].colour = hardSnake[hardSnake.length-1].colour;
   }
}

function handleMouseUp(e){

  //mouseup event determines where on screen user selected, which determines difficulty
  //clears existing timer and sets up new timer, begins game
  let rect = canvas.getBoundingClientRect();
  if(e.pageX - rect.left <= canvas.width*(1/3)){
    clearInterval(easyAnimationTimer);
    clearInterval(mediumAnimationTimer);
    clearInterval(hardAnimationTimer);
    timer = setInterval(handleTimer, 125);
    $("#canvas").off("mouseup");
    difficulty = "easy";
    initGame();
    drawCanvas();
  }
  if(e.pageX - rect.left > canvas.width*(1/3) && e.pageX - rect.left < canvas.width*(2/3)){
    clearInterval(easyAnimationTimer);
    clearInterval(mediumAnimationTimer);
    clearInterval(hardAnimationTimer);
    timer = setInterval(handleTimer, 75);
    $("#canvas").off("mouseup");
    difficulty = "medium";
    initGame();
    drawCanvas();
  }
  if(e.pageX - rect.left>= canvas.width*(2/3)){
    clearInterval(easyAnimationTimer);
    clearInterval(mediumAnimationTimer);
    clearInterval(hardAnimationTimer);
    timer = setInterval(handleTimer, 50);
    $("#canvas").off("mouseup");
    difficulty = "hard";
    initGame();
    drawCanvas();
  }
}

//********************
//GAME ITSELF
//********************
let snake = [];
let pellet;

//initializes game components
function initGame(){
  $(document).keydown(handleKeyDown);

  dx = 0;
  dy = 0;

  snake = [];
  snake.push({
    h: 8,
    w: 8,
    x: 320 + 1,
    y: 120 + 1,
    dx: 0,
    dy: 0,
    colour: 'white'
  });

  pellet = {
    h: 8,
    w: 8,
    x: 320 + 1,
    y: 240 + 1,
    colour: 'white'
  };
}

function handleTimer(){
  drawCanvas();
  let head = snake.length-1;
  snake[head].dx = dx;
  snake[head].dy = dy;

  //detect and handle collission with walls
  if(snake[head].x + snake[head].w + 1 == 640 && snake[head].dx == 10 ||
     snake[head].x - 1 == 0 && snake[head].dx == -10 ||
     snake[head].y + snake[head].h + 1 >= 480 && snake[head].dy == 10 ||
     snake[head].y - 1 == 0 && snake[head].dy == -10){
       snake[head].colour = 'red';
       pellet.colour = 'grey';
       for(let i = 0; i < head; i++){
         snake[i].colour = 'grey';
       }
       endGame();
       return;
  }

  //detect and handle collission with snake itself
  for(let i = 0; i < head; i++){
    if(snake[head].x + snake[head].w + 2 == snake[i].x && snake[head].y == snake[i].y && snake[head].dx == 10 ||
       snake[head].x - 2 == snake[i].x + snake[i].w && snake[head].y == snake[i].y && snake[head].dx == -10 ||
       snake[head].y + snake[head].h + 2 == snake[i].y && snake[head].x == snake[i].x && snake[head].dy == 10 ||
       snake[head].y - 2 == snake[i].y + snake[i].h && snake[head].x == snake[i].x && snake[head].dy == -10){
         snake[head].colour = 'red';
         pellet.colour = 'grey';
         for(let i = 0; i < head; i++){
           snake[i].colour = 'grey';
         }
         endGame();
         return;
    }
  }

  //move snake
  for(let i = 0; i < head; i++){
    snake[i].x = snake[i+1].x;
    snake[i].y = snake[i+1].y;
  }
  snake[head].x += snake[head].dx;
  snake[head].y += snake[head].dy;

  //detect and handle collission with pellet
  if(snake[head].x >= pellet.x && snake[head].x + snake[head].w <= pellet.x + pellet.w
  && snake[head].y >= pellet.y && snake[head].y + snake[head].h <= pellet.y + pellet.h){

    //add 3 sections to snake for each pellet collission
    for(let i = 0; i < 3; i++){
      snake.push({
        h: 8,
        w: 8,
        x: pellet.x,
        y: pellet.y,
        dx: snake[head].dx,
        dy: snake[head].dy,
        colour: 'white'
      });
    }

    //generate random location for pellet that does not collide with snake
    let validCoords = 'false';
    let x;
    let y;
    while(validCoords == 'false'){
      x = Math.floor((Math.random() * 63) + 1) * 10 + 1;
      y = Math.floor((Math.random() * 47) + 1) * 10 + 1;
      let invalid = 0;
      for(let i = 0; i < head; i++){
        if(x == snake[i].x && y == snake[i].y){
          invalid++;
        }
      }
      if(invalid == 0){validCoords = 'true';}
    }
    pellet.x = x;
    pellet.y = y;
  }
}

let up = 38;
let down = 40;
let right = 39;
let left = 37;

//handle snake movement depending on which key is pressed
//ensure snake cannot move directly backwards
function handleKeyDown(key){
  let head = snake.length-1;
  if(key.which == up && snake[head].dy != 10){
    dy = -10;
    dx = 0;
  }
  else if(key.which == down && snake[head].dy != -10){
    dy = 10;
    dx = 0;
  }
  else if(key.which == left && snake[head].dx != 10){
    dx = -10;
    dy = 0;
  }
  else if(key.which == right && snake[head].dx != -10){
    dx = 10;
    dy = 0;
  }
}

function drawCanvas(){
  //erase canvas
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw snake
  for(let i = 0; i < snake.length; i++){
    context.fillStyle = snake[i].colour;
    context.fillRect(snake[i].x, snake[i].y, snake[i].h, snake[i].w);
  }

  //draw pellet
  context.fillStyle = pellet.colour;
  context.fillRect(pellet.x, pellet.y, pellet.h, pellet.w);
}

//********************
//END GAME
//********************
function endGame(){
  clearInterval(timer);
  drawCanvas();

  $("#canvas").mouseup(handleMouseUpEndGame);
  let score = snake.length-1;

  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.strokeStyle = 'white';

  //send difficulty and score to server
  //receive back a JSON object of highscores, and an indication of whether or not
  //the user has gotten a highscore themselves
  let postObj = {score: score, difficulty: difficulty};
  $.post('/playerScore', postObj, function(data, status){
    let highscorePos = data.highscorePos;
    if(data.newHighscore == 'true'){
      context.font = '18pt Arial';
      context.fillText("New " + difficulty + '-mode highscore! You scored:', canvas.width*(1/2), 50);
      context.font = '30pt Arial';
      context.fillText(score, canvas.width*(1/2), 100);
      setTimeout(postName, 500);
    }
    else{
      context.font = '18pt Arial';
      context.fillText('You scored:', canvas.width*(1/2), 50);
      context.font = '30pt Arial';
      context.fillText(score, canvas.width*(1/2), 100);
    }

    context.font = '18pt Arial';
    context.fillText('Highscores', canvas.width*(1/2), 175);
    context.textAlign = 'left';
    for(let i = 0; i < data.highscores[difficulty]['names'].length; i++){
      context.fillText(data.highscores[difficulty]['names'][i] + ': ', canvas.width*(1/2) - 100, 200 + (i*25));
      context.fillText(data.highscores[difficulty]['scores'][i] + '', canvas.width*(1/2) + 50, 200 + (i*25));
    }

    //collect user's name, send back to server to be written into highscores
    function postName(){
      let name = prompt('Enter your name:');
      if(name){
        let postObj = {difficulty: difficulty, highscorePos: highscorePos, name: name, score: score};
        $.post('/playerScoreAndName', postObj, function(data, status){});
      }
    }
  });

  //return to menu to restart game
  context.font = '18pt Arial';
  context.textAlign = 'center';
  context.fillText("Click to play again", canvas.width*(1/2), 430)
  function handleMouseUpEndGame(e){
    $("#canvas").off("mouseup");
    initMenu();
  }
}
