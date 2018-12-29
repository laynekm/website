console.log('Welcome to Tetris.');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
$(document).keydown(handleKeyDown);

class Block {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.h = 9;
    this.w = 9;
    this.colour = c;
  }
}

class Tetromino {
  constructor() {
    this.blocks = [];
    this.type = null;
    this.x = 0;
    this.y = 0;
    this.dy = 0;
    this.w = 0;
    this.h = 0;
  }

  drop() {
    this.y += this.dy;
    for(let block of this.blocks) {
      block.y += this.dy;
    }
  }

  move(dx) {
    this.x += dx;
    for(let block of this.blocks) {
      block.x += dx;
    }
  }

  // Populates tetromino with new blocks and drops them
  dropNewBlocks(type, x, y, dy) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.rotation = 0;

    if(type === 'I') {
      this.blocks.push(new Block(x, y, '#00ffff'));
      this.blocks.push(new Block(x, y + 10, '#00ffff'));
      this.blocks.push(new Block(x, y + 20, '#00ffff'));
      this.blocks.push(new Block(x, y + 30, '#00ffff'));
      this.w = 10;
      this.h = 40;
    }
    else if(type === 'J') {
      this.blocks.push(new Block(x + 10, y, '#0000ff'));
      this.blocks.push(new Block(x + 10, y + 10, '#0000ff'));
      this.blocks.push(new Block(x + 10, y + 20, '#0000ff'));
      this.blocks.push(new Block(x, y + 20, '#0000ff'));
      this.w = 20;
      this.h = 30;
    }
    else if(type === 'L') {
      this.blocks.push(new Block(x, y, '#ffa500'));
      this.blocks.push(new Block(x, y + 10, '#ffa500'));
      this.blocks.push(new Block(x, y + 20, '#ffa500'));
      this.blocks.push(new Block(x + 10, y + 20, '#ffa500'));
      this.w = 20;
      this.h = 30;
    }
    else if(type === 'O') {
      this.blocks.push(new Block(x, y, '#ffff00'));
      this.blocks.push(new Block(x + 10, y, '#ffff00'));
      this.blocks.push(new Block(x, y + 10, '#ffff00'));
      this.blocks.push(new Block(x + 10, y + 10, '#ffff00'));
      this.w = 20;
      this.h = 20;
    }
    else if(type === 'S') {
      this.blocks.push(new Block(x, y + 10, '#00ff00'));
      this.blocks.push(new Block(x + 10, y, '#00ff00'));
      this.blocks.push(new Block(x + 10, y + 10, '#00ff00'));
      this.blocks.push(new Block(x + 20, y, '#00ff00'));
      this.w = 30;
      this.h = 20;
    }
    else if(type === 'T') {
      this.blocks.push(new Block(x, y, '#aa00ff'));
      this.blocks.push(new Block(x + 10, y, '#aa00ff'));
      this.blocks.push(new Block(x + 20, y, '#aa00ff'));
      this.blocks.push(new Block(x + 10, y + 10, '#aa00ff'));
      this.w = 30;
      this.h = 20;
    }
    else if(type === 'Z') {
      this.blocks.push(new Block(x, y, '#ff0000'));
      this.blocks.push(new Block(x + 10, y, '#ff0000'));
      this.blocks.push(new Block(x + 10, y + 10, '#ff0000'));
      this.blocks.push(new Block(x + 20, y + 10, '#ff0000'));
      this.w = 30;
      this.h = 20;
    }
    else {
      // Invalid
    }
  }
}

let tetrominos = [];
let tetromino1 = new Tetromino();
tetromino1.dropNewBlocks('I', 50, 50, 5);
tetrominos.push(tetromino1);

let tetromino2 = new Tetromino();
tetromino2.dropNewBlocks('J', 100, 50, 5);
tetrominos.push(tetromino2);

let tetromino3 = new Tetromino();
tetromino3.dropNewBlocks('L', 150, 50, 5);
tetrominos.push(tetromino3);

let tetromino4 = new Tetromino();
tetromino4.dropNewBlocks('O', 200, 50, 5);
tetrominos.push(tetromino4);

let tetromino5 = new Tetromino();
tetromino5.dropNewBlocks('S', 250, 50, 5);
tetrominos.push(tetromino5);

let tetromino6 = new Tetromino();
tetromino6.dropNewBlocks('T', 300, 50, 5);
tetrominos.push(tetromino6);

let tetromino7 = new Tetromino();
tetromino7.dropNewBlocks('Z', 350, 50, 5);
tetrominos.push(tetromino7);

let blocks = [];
let level = 1;

$(document).ready(function() {
  timer = setInterval(handleTimer, 100);
});

function handleTimer() {
  drawCanvas();
  for(tetromino of tetrominos) {
    if(tetromino.y + tetromino.h < canvas.height) {
      tetromino.drop();
    }
    else {
      // Add blocks to main block array and remove from tetromino
    }
  }
}

function handleKeyDown(key){
  let up = 38;
  let down = 40;
  let right = 39;
  let left = 37;

  if(key.which == left || key.which == right){
    key.view.event.preventDefault();
  }

  if(key.which == left && tetromino1.x > 0){
    tetromino1.move(-10);
  }
  else if(key.which == right && tetromino1.x + tetromino1.w < canvas.width){
    console.log('move right');
    tetromino1.move(10);
  }
}

function drawCanvas() {
  // Erase canvas
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw blocks
  for(let block of blocks) {
    context.fillStyle = block.colour;
    context.fillRect(block.x, block.y, block.h, block.w);
  }

  for(tetromino of tetrominos) {
    for(let block of tetromino.blocks) {
      context.fillStyle = block.colour;
      context.fillRect(block.x, block.y, block.h, block.w);
    }
  }
}
