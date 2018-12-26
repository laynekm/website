// Runs every time page is loaded
checkColourCookie();

// Amends the css link to use the selected colour, then sets cookie
function changeColour(colour){
  document.getElementById('colourStyle').setAttribute('href', `/stylesheets/${colour}_theme.css`);
  setColourCookie(colour);
}

// Sets cookie colour to exist for some date far into the future (can't set forever)
function setColourCookie(colour){
  var date = new Date();
  date.setTime(date.getTime() + (1000 * 24 * 60 * 60 * 1000));
  let expires = date.toUTCString();
  document.cookie = 'colour=' + colour + ';expires=' + expires + ';path=/';
  console.log('Colour cookie set!')
}

// Returns the value associated with the name colour in cookie
function getColourCookie() {
    var name = 'colour=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++){
        var c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0){
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

// Sets colour based on cookie if cookie exists, otherwise sets default (blue)
function checkColourCookie(){
  let colour = getColourCookie();
  document.getElementById('colourStyle').setAttribute('href', `/stylesheets/${colour}_theme.css`);
  if(colour){
    document.getElementById('colourStyle').setAttribute('href', `/stylesheets/${colour}_theme.css`);
  }
  else{
    document.getElementById('colourStyle').setAttribute('href', `/stylesheets/blue_theme.css`);
  }
}

// Source: https://www.w3schools.com/js/js_cookies.asp
