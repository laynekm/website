const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
$(document).keydown(handleKeyDown);
$(document).ready(() => { timer = setInterval(handleTimer, 25) });

const SPACE = 32;
const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;
const UNIT = 20;
let score = 0;
let level = 1;
let dropCounter = 0;
let dropMax = 40;
let blocks = [];
let gameStart = false;
let gameOver = false;

// Colour and relative offsets of game pieces at each rotation state
// TODO: convert to generic UNITs, or maybe store in a separate JSON file?
const pieces = {
  'I': {
    colour: '#00ffff',
    state: [
      [{x: 20, y: 00}, {x: 20, y: 20}, {x: 20, y: 40}, {x: 20, y: 60}],
      [{x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}],
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
  x: UNIT,
  y: UNIT,
  h: UNIT * 20,
  w: UNIT * 10,
  colours: ['#626262', '#4b4b4b'],
}

class Block {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.h = UNIT;
    this.w = UNIT;
    this.colour = c;
  }
}

class Piece {
  constructor() {
    this.blocks = [];
    this.potentialPieces = [];
    this.type = null;
    this.nextType = this.randomType();
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
    if(dr > 0) {
      this.r < 3 ? this.r += 1 : this.r = 0;
    }
    else {
      this.r > 0 ? this.r -= 1 : this.r = 3;
    }
    for(let i in this.blocks) {
      this.blocks[i].x = this.x + pieces[this.type].state[this.r][i].x;
      this.blocks[i].y = this.y + pieces[this.type].state[this.r][i].y;
    }
  }

  // Populates game piece with new blocks based on type
  create(type = this.nextType) {
    this.type = type;
    this.x = UNIT * 5;
    this.y = 0;

    for(let block of pieces[type].state[0]) {
      this.blocks.push(new Block(this.x + block.x, this.y + block.y - UNIT, pieces[type].colour));
    }

    this.nextType = this.randomType();
  }

  // Clears blocks array and returns a copy
  destroy() {
    let blockCopies = [...this.blocks];
    this.blocks = [];
    return blockCopies;
  }

  // Choose type from a 'bag' of potential types to avoid strings of the same type
  randomType() {
    if (this.potentialPieces.length === 0) {
      this.potentialPieces = ['I','I','I','I','J','J','J','J','L','L','L','L','S','S','S','S','Z','Z','Z','Z','T','T','T','T','O','O','O','O'];
    }
    return this.potentialPieces.splice(Math.floor(Math.random() * this.potentialPieces.length), 1);
  }
}

const nextPieceBoard = {
  x: UNIT * 12,
  y: UNIT * 2.5,
  h: UNIT * 5,
  w: UNIT * 9,
  colour: '#626262',
  nextPiece: Block,
}

// Only one Piece is created and its block contents are continually updated
let piece = new Piece();

// Removes blocks from board and returns array of the lines removed (ie. their yCoords)
function removeLines() {
  let linesToRemove = [];

  // If 10 blocks have the same yCoord, add that yCoord to linesToRemove
  for(let i in blocks) {
    let yValue = blocks[i].y;
    let yCounter = 0;
    for(let j in blocks) {
      if(blocks[i].y === blocks[j].y){
        yCounter++;
      }
    }

    if(yCounter === 10) {
      if(!linesToRemove.includes(yValue)) {
        linesToRemove.unshift(yValue);
      }
    }
  }

  // Update line coord based on how many lines will be removed prior
  for(let i = linesToRemove.length - 1; i >= 0; i--) {
    linesToRemove[i] += UNIT * i;
  }

  // Remove blocks at given yCoords and shift all above blocks down
  for(let line of linesToRemove) {
    blocks = blocks.filter(block => block.y !== line);
    for(let block of blocks) {
      if (block.y < line) {
        block.y += UNIT;
      }
    }
  }

  return linesToRemove;
}

// Update game values based on lines removed
// (1 line --> 100 points, 1000 points --> new level, level 10 is max)
let updateScore = false;
function updateValues(lines) {
  for(let line of lines) {
    score += 100;
    updateScore = true;
  }

  if(score % 1000 === 0 && updateScore) {
    level++;
    updateScore = false;
  }

  dropMax <= 5 ? dropMax : dropMax = 40 - level * 4;
}

function handleGameOver() {
  gameOver = true;
  gameStart = false;
  blocks = [];
  piece.blocks = [];
}

function handleGameStart() {
  gameStart = true;
  gameOver = false;
  score = 0;
  level = 1;
  dropCounter = 0;
  dropMax = 40;
  piece.create();
}

// Game loop
function handleTimer() {
  drawCanvas();
  dropCounter++;

  // Case where piece cannot be dropped any further
  if(dropCounter == dropMax && !validDrop(piece, UNIT)) {
    blocks.push(...piece.destroy());
    updateValues(removeLines());
    piece.create();
    dropCounter = 0;

    // End game if any blocks have reached the top of the board
    for(let block of blocks) {
      if(block.y <= board.y) {
        handleGameOver();
      }
    }
  }

  // Case where piece can be dropped
  if(dropCounter == dropMax && validDrop(piece, UNIT)) {
    piece.drop(UNIT);
    dropCounter = 0;
  }
}

// Checks if left/right movement is valid
function validMove(piece, dx) {
  for(let block of piece.blocks) {
    // Checks if block collides with board boundaries
    if(block.x + dx < board.x ||
        block.x + block.w + dx > board.x + board.w) {
        return false;
    }

    // Checks if block collides with other blocks
    for(let j in blocks) {
      if(block.x + dx === blocks[j].x && block.y === blocks[j].y) {
        return false;
      }
    }
  }

  return true;
}

// Checks if downward movement is valid
function validDrop(piece, dy) {
  for(let pieceBlock of piece.blocks) {
    // Check if block collides with board boundaries
    if(pieceBlock.y + pieceBlock.h + dy > board.y + board.h) {
      return false;
    }

    // Check if block collides with other blocks
    for(let gameBlock of blocks) {
      if(pieceBlock.y + pieceBlock.h + dy > gameBlock.y && pieceBlock.x === gameBlock.x) {
        return false;
      }
    }
  }

  return true;
}

// Checks if rotation is valid
function validRotate(piece, dr) {
  let tempR;
  if(dr > 0) {
    piece.r < 3 ? tempR = piece.r + 1 : tempR = 0;
  }
  else {
    piece.r > 0 ? tempR = piece.r - 1 : tempR = 3;
  }

  for(let i in piece.blocks) {
    // Check if blocks collide with board boundaries
    if(piece.x + pieces[piece.type].state[tempR][i].x >= board.x + board.w ||
       piece.x + pieces[piece.type].state[tempR][i].x < board.x ||
       piece.y + pieces[piece.type].state[tempR][i].y >= board.y + board.h) {
         return false;
       }

    // Check if block collides with other blocks
    for(let j in blocks) {
      if(piece.x + pieces[piece.type].state[tempR][i].x === blocks[j].x &&
         piece.y + pieces[piece.type].state[tempR][i].y === blocks[j].y) {
           return false;
         }
    }
  }

  return true;
}

function handleKeyDown(key){
  // Prevents page from scrolling
  if(key.which == SPACE || key.which == LEFT || key.which == RIGHT | key.which == UP || key.which == DOWN){
    key.view.event.preventDefault();
  }

  if(key.which == SPACE && !gameStart) {
    handleGameStart();
  }

  if(key.which == LEFT && validMove(piece, -20)){
    piece.move(-20);
  }
  else if(key.which == RIGHT && validMove(piece, 20)){
    piece.move(20);
  }

  if(key.which == UP && validRotate(piece, 1)){
    piece.rotate(1);
  }
  else if(key.which == DOWN && validRotate(piece, -1)){
    piece.rotate(-1);
  }

  if(key.which == SPACE && validDrop(piece, 20)){
    piece.drop(20);
    dropCounter = 0;
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

  // Draw board that shows the next piece
  context.fillStyle = nextPieceBoard.colour;
  context.fillRect(nextPieceBoard.x, nextPieceBoard.y, nextPieceBoard.w, nextPieceBoard.h)
  if(gameStart && piece.nextType) {
    for(let block of pieces[piece.nextType].state[0]) {
      context.fillStyle = 'black';
      context.fillRect(nextPieceBoard.x + block.x + UNIT * 2, nextPieceBoard.y + block.y + UNIT, UNIT, UNIT);
      context.fillStyle = pieces[piece.nextType].colour;
      context.fillRect(nextPieceBoard.x + block.x + 1 + UNIT * 2, nextPieceBoard.y + block.y + 1 + UNIT, UNIT- 2, UNIT - 2);
    }
  }

  // Draw labels
  context.textAlign = 'left';
  context.fillStyle = 'white';
  context.font = '14pt Arial';
  context.fillText('Next piece:', UNIT * 12, UNIT * 2);
  context.fillText('Level: ' + level, UNIT * 12, UNIT * 9);
  context.fillText('Score: ' + score, UNIT * 12, UNIT * 11 )

  // Draw blocks in game board
  for(let block of blocks) {
    context.fillStyle = 'black';
    context.fillRect(block.x, block.y, block.w, block.h)
    context.fillStyle = block.colour;
    context.fillRect(block.x + 1, block.y + 1, block.w - 2, block.h - 2);
  }

  // Draw blocks in game piece
  for(let block of piece.blocks) {
    if(block.y >= board.y) {
      context.fillStyle = 'black';
      context.fillRect(block.x, block.y, block.w, block.h)
      context.fillStyle = block.colour;
      context.fillRect(block.x + 1, block.y + 1, block.w - 2, block.h - 2);
    }
  }

  // Draw initial screen
  if (!gameStart && !gameOver) {
    context.fillStyle = 'white';
    context.font = '14pt Arial';
    context.textAlign = 'center';
    context.fillText('Press space to play', (board.x + board.w) / 2 + UNIT / 2, UNIT * 10);
  }

  // Draw game over screen
  if (gameOver) {
    context.fillStyle = 'white';
    context.font = 'bold 40pt Arial';
    context.textAlign = 'center';
    context.fillText('GAME', (board.x + board.w) / 2 + UNIT / 2, UNIT * 10);
    context.fillText('OVER', (board.x + board.w) / 2 + UNIT / 2, UNIT * 14);
    context.font = '14pt Arial';
    context.fillText('Press space to play', (board.x + board.w) / 2 + UNIT / 2, UNIT * 18);
  }
}
