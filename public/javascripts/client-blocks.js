console.log('Welcome to Puzzle Blocks.');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
$(document).keydown(handleKeyDown);

const space = 32;
const up = 38;
const down = 40;
const right = 39;
const left = 37;

// Colour and relative offsets of game pieces at each rotation state
// Maybe just save this as a JSON file?
const pieces = {
  'I': {
    colour: '#00ffff',
    state: [
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 20, y: 60}],
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}],
      [{x: 40, y: 00}, {x: 40, y: 20}, {x: 40, y: 40}, {x: 40, y: 60}],
      [{x: 00, y: 40}, {x: 20, y: 40}, {x: 40, y: 40}, {x: 60, y: 40}],
    ]
  },
  'J': {
    colour: '#0000ff',
    state: [
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 00, y: 40}],
      [{x: 00, y: 00}, {x: 00, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}],
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 40, y: 00}],
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 40, y: 40}],
    ]
  },
  'L': {
    colour: '#ffa500',
    state: [
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 40, y: 40}],
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 00, y: 40}],
      [{x: 00, y: 00}, {x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}],
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 40, y: 00}],
    ]
  },
  'S': {
    colour: '#00ff00',
    state: [
      [{x: 00, y: 40}, {x: 20, y: 40}, {x: 20, y: 20}, {x: 40, y: 20}],
      [{x: 00, y: 00}, {x: 00, y: 20}, {x: 20, y: 20}, {x: 20, y: 40}],
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 20, y: 00}, {x: 40, y: 00}],
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 40, y: 40}],
    ]
  },
  'Z': {
    colour: '#ff0000',
    state: [
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 40, y: 40}],
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 00, y: 20}, {x: 00, y: 40}],
      [{x: 00, y: 00}, {x: 20, y: 00}, {x: 20, y: 20}, {x: 40, y: 20}],
      [{x: 40, y: 00}, {x: 40, y: 20}, {x: 20, y: 20}, {x: 20, y: 40}],
    ]
  },
  'T': {
    colour: '#aa00ff',
    state: [
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 20, y: 40}],
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 00, y: 20}],
      [{x: 00, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 20, y: 00}],
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 40, y: 20}],
    ]
  },
  'O': {
    colour: '#ffff00',
    state: [
      [{x: 00, y: 00}, {x: 00, y: 20}, {x: 20, y: 00}, {x: 20, y: 20}],
      [{x: 00, y: 00}, {x: 00, y: 20}, {x: 20, y: 00}, {x: 20, y: 20}],
      [{x: 00, y: 00}, {x: 00, y: 20}, {x: 20, y: 00}, {x: 20, y: 20}],
      [{x: 00, y: 00}, {x: 00, y: 20}, {x: 20, y: 00}, {x: 20, y: 20}],
    ]
  }
}

const board = {
  x: 20,
  y: 20,
  h: 400,
  w: 200,
  colours: ['#626262', '#4b4b4b']
}

class Block {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.h = 20;
    this.w = 20;
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
    this.r = 0;
  }

  drop(dy) {
    this.dy = dy;
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
      this.r < 3 ? this.r += 1 : this.r = 0;
    }
    else{
      this.r > 0 ? this.r -= 1 : this.r = 3;
    }
    for(let i in this.blocks) {
      this.blocks[i].x = this.x + pieces[this.type].state[this.r][i].x;
      this.blocks[i].y = this.y + pieces[this.type].state[this.r][i].y;
    }
  }

  // Populates game piece with new blocks and drops them
  // If no argument is provided, it will use a randomly selected one
  create(type = this.randomType()) {
    this.type = type;
    this.x = 100;
    this.y = 20;

    for(let state of pieces[type].state[0]) {
      this.blocks.push(new Block(this.x + state.x, this.y + state.y, pieces[type].colour));
    }
  }

  // Clears blocks array and returns a copy
  destroy() {
    let blockCopies = [...this.blocks];
    this.blocks = [];
    return blockCopies;
  }

  randomType() {
    let tempPieces = ['I', 'J', 'L', 'S', 'Z', 'T', 'O'];
    return tempPieces[Math.floor(Math.random() * tempPieces.length)];
  }
}

let piece = new Piece();
piece.create('T');
let blocks = [];

$(document).ready(function() {
  timer = setInterval(handleTimer, 100);
});

let counter = 0;
function handleTimer() {
  drawCanvas();
  counter++;
  if(!validDrop(piece, 20)) {
    blocks.push(...piece.destroy());
    piece.create();
  }

  if(counter == 10 && validDrop(piece, 20)) {
    piece.drop(20);
    counter = 0;
  }
}

function validMove(piece, dx) {
  for(block of piece.blocks) {
    if(block.x + dx < board.x ||
        block.x + block.w + dx > board.x + board.w) {
        return false;
    }
  }
  return true;
}

function validDrop(piece, dy) {
  for(let pieceBlock of piece.blocks) {
    if(pieceBlock.y + pieceBlock.h + dy > board.y + board.h) {
      return false;
    }
    for(let gameBlock of blocks) {
      if(pieceBlock.y + pieceBlock.h + dy > gameBlock.y && pieceBlock.x === gameBlock.x) {
        return false;
      }
    }
  }
  return true;
}

function validRotate(piece, dr) {
  return true;
}

function handleKeyDown(key){
  // Prevents page from scrolling
  if(key.which == space || key.which == left || key.which == right | key.which == up || key.which == down){
    key.view.event.preventDefault();
  }

  if(key.which == left && validMove(piece, -20)){
    piece.move(-20);
  }
  else if(key.which == right && validMove(piece, 20)){
    piece.move(20);
  }

  if(key.which == up && validRotate(1)){
    piece.rotate(1);
  }
  else if(key.which == down && validRotate(-1)){
    piece.rotate(-1);
  }

  if(key.which == space && validDrop(piece, 20)){
    piece.drop(20);
    counter = 0;
  }
}

function drawCanvas() {
  // Erase canvas
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw board
  for(let i = 1; i <= 10; i++){
    i % 2 == 0 ? context.fillStyle = board.colours[0] : context.fillStyle = board.colours[1];
    context.fillRect(i * 20, 20, 20, board.h);
  }

  // Draw blocks in game board
  for(let block of blocks) {
    context.fillStyle = 'black';
    context.fillRect(block.x, block.y, block.w, block.h)
    context.fillStyle = block.colour;
    context.fillRect(block.x + 1, block.y + 1, block.w - 2, block.h - 2);
  }

  // Draw blocks in game piece
  for(let block of piece.blocks) {
    context.fillStyle = 'black';
    context.fillRect(block.x, block.y, block.w, block.h)
    context.fillStyle = block.colour;
    context.fillRect(block.x + 1, block.y + 1, block.w - 2, block.h - 2);
  }
}
