let socket = io();
let stage = new Konva.Stage({
    container: 'container',
    width: 300,
    height: 600
});
let layer = new Konva.Layer();
stage.add(layer)

let magnets = [];
let magnetCoords = [];

//receive initial magnet coordinates
let initialized = 'false';
socket.emit('initialMagnetData');
socket.on('initialMagnetData', function(data){
  magnetCoords = data;
  if(initialized == 'false'){
    init();
  }
});

//draw shapes and add them to the magnets array
let init = function(){
  initialized = 'true';

  let square = new Konva.Rect({
    x: magnetCoords[0].x,
    y: magnetCoords[0].y,
    width: 50,
    height: 50,
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 1,
    draggable: true,
    dragBoundFunc: function(pos) {
      let x = pos.x;
      let y = pos.y;
      if(pos.y < 0){          y = 0;}
      else if(pos.y > 550){   y = 550;}
      if(pos.x < 0){          x = 0;}
      else if(pos.x > 250){   x= 250;}
      return {x: x, y: y}
    }
  });

  let circle = new Konva.Circle({
    x: magnetCoords[1].x,
    y: magnetCoords[1].y,
    radius: 25,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 1,
    draggable: true,
    dragBoundFunc: function(pos) {
      let x = pos.x;
      let y = pos.y;
      if(pos.y < 25){         y = 25;}
      else if(pos.y > 575){   y = 575;}
      if(pos.x < 25){         x = 25;}
      else if(pos.x > 275){   x= 275;}
      return {x: x, y: y}
    }
  });

  let text = new Konva.Text({
    x: magnetCoords[2].x,
    y: magnetCoords[2].y,
    text: 'Live Laugh Love',
    fontSize: 20,
    fontFamily: 'Arial',
    fill: 'green',
    stroke: 'black',
    strokeWidth: 1,
    draggable: true,
    dragBoundFunc: function(pos) {
      let x = pos.x;
      let y = pos.y;
      if(pos.y < 0){         y = 0;}
      else if(pos.y > 580){   y = 580;}
      if(pos.x < 0){         x = 0;}
      else if(pos.x > 150){   x= 150;}
      return {x: x, y: y}
    }
  });

  let ring = new Konva.Ring({
    x: magnetCoords[3].x,
    y: magnetCoords[3].y,
    innerRadius: 10,
    outerRadius: 25,
    fill: 'yellow',
    stroke: 'black',
    strokeWidth: 1,
    draggable: true,
    dragBoundFunc: function(pos) {
      let x = pos.x;
      let y = pos.y;
      if(pos.y < 25){         y = 25;}
      else if(pos.y > 575){   y = 575;}
      if(pos.x < 25){         x = 25;}
      else if(pos.x > 275){   x= 275;}
      return {x: x, y: y}
    }
  });

  let star = new Konva.Star({
    x: magnetCoords[4].x,
    y: magnetCoords[4].y,
    numPoints: 5,
    innerRadius: 10,
    outerRadius: 25,
    fill: 'orange',
    stroke: 'black',
    strokeWidth: 1,
    draggable: true,
    dragBoundFunc: function(pos) {
      let x = pos.x;
      let y = pos.y;
      if(pos.y < 25){         y = 25;}
      else if(pos.y > 575){   y = 575;}
      if(pos.x < 25){         x = 25;}
      else if(pos.x > 275){   x= 275;}
      return {x: x, y: y}
    }
  });

  //prevents duplicates
  magnets.push(square);
  magnets.push(circle);
  magnets.push(text);
  magnets.push(ring);
  magnets.push(star);

  for(let i = 0; i < magnets.length; i++){
    let magnet = magnets[i];
    layer.add(magnet);

    magnet.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    magnet.on('mouseout', function() {
        document.body.style.cursor = 'default';
    });
    magnet.on('dragmove', function(){
      magnetCoords[i].x = magnet.attrs.x;
      magnetCoords[i].y = magnet.attrs.y;
      socket.emit('magnetData', magnetCoords[i]);
    });
  }

  layer.draw();
}

socket.on('magnetData', function(data){
  for(let i = 0; i < magnets.length; i++){
    let dx = data[i].x - magnets[i].attrs.x;
    let dy = data[i].y - magnets[i].attrs.y;
    magnets[i].move({x: dx, y: dy});
    layer.draw();
  }
});
