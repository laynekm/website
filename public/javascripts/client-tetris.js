console.log('Welcome to Tetris.');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

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
  }
}

let tetromino = new Tetromino();
tetromino.blocks.push(new Block(100, 100, 'white'));
tetromino.blocks.push(new Block(110, 100, 'white'));
tetromino.blocks.push(new Block(100, 110, 'white'));
tetromino.blocks.push(new Block(110, 110, 'white'));

let blocks = [];
let level = 1;

$(document).ready(function() {
  timer = setInterval(handleTimer, 100);
});

function handleTimer() {
  drawCanvas();
  for (let block of tetromino.blocks) {
    block.y += (level * 10);
  }
}

function drawCanvas() {
  // Erase canvas
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw blocks
  for (let block of blocks) {
    context.fillStyle = block.colour;
    context.fillRect(block.x, block.y, block.h, block.w);
  }

  for (let block of tetromino.blocks) {
    context.fillStyle = block.colour;
    context.fillRect(block.x, block.y, block.h, block.w);
  }
}
