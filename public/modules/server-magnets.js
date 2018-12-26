let magnetCoords = [
  {type: 'Rect', x: 100, y: 100},
  {type: 'Circle', x: 100, y: 175},
  {type: 'Text', x: 100, y: 250},
  {type: 'Ring', x: 100, y: 325},
  {type: 'Star', x: 100, y: 400}
];

exports.getMagnetCoords = function() {
  return magnetCoords;
}

exports.setMagnetCoords = function(data) {
  for(let i = 0; i < magnetCoords.length; i++){
    if(magnetCoords[i].type == data.type){
      magnetCoords[i] = data;
    }
  }
}
