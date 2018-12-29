console.log('Welcome to Puzzle Blocks.');
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

class Piece {
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

  rotate(dr) {
    if(dr > 0){

    }
    else{

    }
  }

  // Populates game piece with new blocks and drops them
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

let pieces = [];
let piece1 = new Piece();
piece1.dropNewBlocks('I', 50, 50, 5);
pieces.push(piece1);

let piece2 = new Piece();
piece2.dropNewBlocks('J', 100, 50, 5);
pieces.push(piece2);

let piece3 = new Piece();
piece3.dropNewBlocks('L', 150, 50, 5);
pieces.push(piece3);

let piece4 = new Piece();
piece4.dropNewBlocks('O', 200, 50, 5);
pieces.push(piece4);

let piece5 = new Piece();
piece5.dropNewBlocks('S', 250, 50, 5);
pieces.push(piece5);

let piece6 = new Piece();
piece6.dropNewBlocks('T', 300, 50, 5);
pieces.push(piece6);

let piece7 = new Piece();
piece7.dropNewBlocks('Z', 350, 50, 5);
pieces.push(piece7);

let blocks = [];
let level = 1;

$(document).ready(function() {
  timer = setInterval(handleTimer, 100);
});

function handleTimer() {
  drawCanvas();
  for(piece of pieces) {
    if(piece.y + piece.h < canvas.height) {
      piece.drop();
    }
    else {
      // Add blocks to main block array and remove from game piece
    }
  }
}

function handleKeyDown(key){
  let up = 38;
  let down = 40;
  let right = 39;
  let left = 37;

  if(key.which == left || key.which == right | key.which == up || key.which == down){
    key.view.event.preventDefault();
  }

  if(key.which == left && piece1.x > 0){
    piece1.move(-10);
  }
  else if(key.which == right && piece1.x + piece1.w < canvas.width){
    piece1.move(10);
  }

  if(key.which == up){
    piece1.rotate(1);
  }
  else if(key.which == down){
    piece1.rotate(-1);
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

  for(piece of pieces) {
    for(let block of piece.blocks) {
      context.fillStyle = block.colour;
      context.fillRect(block.x, block.y, block.h, block.w);
    }
  }
}
