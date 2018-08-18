let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let balls = [];
let timer;
let communicationString = "";

$(document).ready(function() {
  $("#canvas").click(handleClick);
  timer = setInterval(handleTimer, 10);
});

//when user clicks canvas, generate new ball in the position they selected
//and add ball to ball array
function handleClick(e){
  $("#clearButton").attr("disabled", false);
  $("#tidyButton").attr("disabled", false);

  let rect = canvas.getBoundingClientRect();
  let x = e.pageX - rect.left;
  let dx = 1;
  let ax = 1.001;
  let y = e.pageY - rect.top;
  let dy = 1;
  let ay = 1.001;
  let r = 15;
  let n = balls.length + 1;
  let c = randomColour();
  let dropFrom = [x, y];
  let moveTo = [];
  let clearFrom = [];

  //accounting for when canvas is resized with css (ie. window smaller)
  //not perfect but much better
  let stringWidth = $('.main-body').css('width');
  let w = stringWidth.substring(0, stringWidth.length - 2);
  if(w < 680){
    x = x + (680 - w) * (x/w);
  }

  if(x - r > 0 && x + r < canvas.width && balls.length < 20){
    let newBall = {x: x, dx: dx, ax: ax,
                   y: y, dy: dy, ay: ay,
                   r: r,  n: n,   c: c,
                   dropFrom: dropFrom,
                   moveTo: moveTo,
                   clearFrom: clearFrom};
    balls.push(newBall);
  }
}

function handleClearButton(){
  $("#canvas").off("click");
  $("#bubblesortButton").attr("disabled", true);
  $("#insertionsortButton").attr("disabled", true);
  $("#selectionsortButton").attr("disabled", true);
  $("#clearButton").attr("disabled", true);
  $("#tidyButton").attr("disabled", true);
  setTimeout(clearBalls, 500);

  //adds an animation so the balls scatter in random directions
  for(let i = 0; i < balls.length; i++){
    let ball = balls[i];
    ball.dropFrom = [];
    ball.moveTo = [];
    ball.clearFrom = [ball.x, ball.y];
    ball.dy = -2;
    if(Math.random() < 0.5){ ball.dx = Math.floor((Math.random() * 20) + 1) * -1;}
    else{ball.dx = Math.floor((Math.random() * 20) + 1); }
  }

  //once the balls have scattered, clear array and reset fields
  function clearBalls(){
    balls = [];
    $("#canvas").click(handleClick);
    communicationString = "";
  }
}

function handleTidyButton(){
  $("#tidyButton").attr("disabled", true);
  $("#bubblesortButton").attr("disabled", false);
  $("#insertionsortButton").attr("disabled", false);
  $("#selectionsortButton").attr("disabled", false);
  $("#canvas").off("click");

  //rearrange array on balls based on ascending x position
  let tempBalls = [];
  for(let i = 0; i <= canvas.width; i++){
    for(let j = 0; j < balls.length; j++){
      if(Math.floor(balls[j].x) == i){
        tempBalls.push(balls[j]);
      }
    }
  }
  balls = tempBalls;

  //move balls so that they're equal distance apart
  let dist = canvas.width / balls.length;
  let newX = dist/2;
  for(let i = 0; i < balls.length; i++){
    let ball = balls[i];
    ball.dropFrom = [];
    ball.clearFrom = [];
    ball.moveTo = [newX, canvas.height - ball.r];
    ball.dx = 1;
    newX += dist;
  }
}

function handleBubblesortButton(){
  $("#tidyButton").attr("disabled", true);
  $("#bubblesortButton").attr("disabled", true);
  $("#insertionsortButton").attr("disabled", true);
  $("#selectionsortButton").attr("disabled", true);

  let i = 0;
  let j = 0;
  let bubblesortTimer = setInterval(handleBubblesortTimer, 250);

  //bubble sort algorithm
  function handleBubblesortTimer(){
    if(i >= balls.length - 1){
      clearInterval(bubblesortTimer);
      if(balls.length > 0){communicationString = "Bubble Sort Complete!";}
    }
    else if(balls[j].y > 400){
      balls[j].moveTo = [balls[j].x, 380 - balls[j].r];
      balls[j+1].moveTo = [balls[j+1].x, 380 - balls[j].r];
    }
    else if(balls[j].y < 400 && balls[j].n > balls[j+1].n){
      let tempBall = balls[j];
      balls[j].moveTo = [balls[j+1].x, balls[j+1].y];
      balls[j+1].moveTo = [tempBall.x, tempBall.y];
      balls[j] = balls[j+1];
      balls[j+1] = tempBall;
    }
    else{
      balls[j].moveTo = [balls[j].x, 480 - balls[j].r];
      balls[j+1].moveTo = [balls[j+1].x, 480 - balls[j].r];
      if(j < balls.length - i - 2){j++;}
      else{
        j = 0;
        i++;
      }
    }
  }
}

function handleInsertionsortButton(){
  $("#tidyButton").attr("disabled", true);
  $("#bubblesortButton").attr("disabled", true);
  $("#insertionsortButton").attr("disabled", true);
  $("#selectionsortButton").attr("disabled", true);

  let i = 1;
  let j;
  let key;
  let insertionsortTimer = setInterval(handleInsertionsortTimer, 250);

  //insertion sort algorithm
  function handleInsertionsortTimer(){
    if(i >= balls.length){
      clearInterval(insertionsortTimer);
      if(balls.length > 0){communicationString = "Insertion Sort Complete!";}
    }
    else if(!key){
      key = balls[i];
      j = i - 1;
    }
    else if(j < 0){
      key.moveTo = [key.x, 480 - key.r];
      balls[j+1] = key;
      key = 0;
      i++;
    }
    else if(key.y > 400){
      key.moveTo = [key.x, 380 - key.r];
    }
    else if(key.y < 400 && balls[j].n <= key.n){
      key.moveTo = [key.x, 480 - key.r];
      key = 0;
      i++;
    }
    else if(key.y < 400 && balls[j].n > key.n){
      key.moveTo = [balls[j].x, 380 - key.r];
      balls[j].moveTo = [balls[j+1].x, 480 - balls[j].r];
      balls[j+1] = balls[j];
      balls[j] = key;
      j--;
    }
    else{
      key.moveTo = [key.x, 480 - key.r];
      balls[j+1] = key;
      key = 0;
      i++;
    }
  }
}

function handleSelectionsortButton(){
  $("#tidyButton").attr("disabled", true);
  $("#bubblesortButton").attr("disabled", true);
  $("#insertionsortButton").attr("disabled", true);
  $("#selectionsortButton").attr("disabled", true);

  let i = 0;
  let j;
  let min = -1;
  let selectionSortTimer = setInterval(handleSelectionsortTimer, 250);

  //selection sort algorithm
  function handleSelectionsortTimer(){
    if(i > balls.length - 1){
      clearInterval(selectionSortTimer);
      if(balls.length > 0){communicationString = "Selection Sort Complete!";}
    }
    else if(min == -1){
      min = i;
      balls[min].moveTo = [balls[min].x, 380 - balls[min].r];
      j = i + 1;
    }
    else if(j > balls.length - 1){
      let tempBall = balls[min];
      balls[min].moveTo = [balls[i].x, 480 - balls[i].r];
      balls[i].moveTo = [tempBall.x, 480 - tempBall.r];

      balls[min] = balls[i];
      balls[i] = tempBall;

      min = -1;
      i++;
    }
    else if(balls[j].y > 400){
      balls[j].moveTo = [balls[j].x, 380 - balls[j].r];
    }
    else if(balls[j].y < 400 && balls[j].n >= balls[min].n){
      balls[j].moveTo = [balls[j].x, 480 - balls[j].r];
      j++;
    }
    else if(balls[j].y < 400 && balls[j].n < balls[min].n){
      balls[min].moveTo = [balls[min].x, 480 - balls[min].r];
      min = j;
      j++;
    }
  }
}

function handleTimer(){
  for(let i = 0; i < balls.length; i++){
    let ball = balls[i];

    //if dropball is not null, ball is dropped from its current position
    if(ball.dropFrom.length > 0){
      if(ball.y + ball.r + ball.dy < canvas.height){
        ball.y += ball.dy;
        ball.dy += ball.ay;
      }
      else{
        ball.y = canvas.height - ball.r;
        if(ball.dy < 2){ball.dy = 0;}
        ball.dy *= -0.6;
      }
    }

    //if moveTo is not null, ball is moved to the given position
    else if(ball.moveTo.length > 0){
      if(ball.x + ball.dx <= ball.moveTo[0]){
        ball.x += ball.dx;
        ball.dx += ball.ax;
      }
      else if(ball.x - ball.dx >= ball.moveTo[0]){
        ball.x -= ball.dx;
        ball.dx += ball.ax;
      }
      else{
        ball.dx = 1;
      }

      if(ball.y + ball.dy < ball.moveTo[1]){
        ball.y += ball.dy;
        ball.dy += ball.ay;
      }
      else if(ball.y - ball.dy > ball.moveTo[1]){
        ball.y -= ball.dy;
        ball.dy += ball.ay;
      }
      else{
        ball.dy = 1;
      }
    }

    //if clearFrom is not null, balls are moved in their random directions
    else if(ball.clearFrom.length > 0){
      ball.x += ball.dx;
      ball.y += ball.dy;
      ball.dy -= ball.ay;
    }
  }

  drawCanvas();
}

function drawCanvas(){
  //erase
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw balls
  context.strokeStyle = 'black';
  context.font = '10pt Arial';
  context.textAlign = 'center';
  for(let i = 0; i < balls.length; i++){
    let ball = balls[i];
    context.fillStyle = ball.c;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI);
    context.fill();
    context.fillStyle = 'black';
    context.fillText(ball.n, ball.x, ball.y + ball.r/3);
  }

  //draw text
  context.font = '20pt Arial';
  context.textAlign = 'center';
  context.fillStyle = 'black';
  context.strokeStyle = 'black';
  context.fillText(communicationString, canvas.width/2, canvas.height/6);
}

//because colours are fun
function randomColour(){
  let colours = [
    "#EF9A9A",
    "#F48FB1",
    "#CE93D8",
    "#B39DDB",
    "#9FA8DA",
    "#81D4FA",
    "#80DEEA",
    "#A5D6A7",
    "#FFF59D",
    "#FFCC80",
    "#FFAB91"
  ];

  let randomNumber = Math.floor((Math.random() * colours.length - 1) + 1)
  return colours[randomNumber];
}
