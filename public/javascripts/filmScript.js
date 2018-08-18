function getFilms() {

  //read in from film input field, verify it has been populated
  let film = document.getElementById('film').value;
  if(!film){return alert('Please enter a film!');}
  let filmDiv = document.getElementById('films');
  filmDiv.innerHTML = '';

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200){
      let response = JSON.parse(xhr.responseText);
      filmDiv.innerHTML = filmDiv.innerHTML + `<h1> Total results: ${response.totalResults} </h1>`;
      filmDiv.innerHTML = filmDiv.innerHTML + `<h1> Results being displayed: ${response.Search.length} </h1>`;
      let films = [];

      //only show those with a poster and of type movie, prevents junk data
      for(let x in response.Search){
        if(response.Search[x].Poster != 'N/A' && response.Search[x].Type == 'movie'){
          films.push(response.Search[x]);
        }
      }

      //iterate through and add div  with title, image, link for each recipe
      for(let x in films){
        let linkURL = `https://www.imdb.com/title/${films[x].imdbID}/`;
        let posterURL = films[x].Poster;
        let title = films[x].Title;
        let year = films[x].Year;

        filmDiv.innerHTML = filmDiv.innerHTML + `
          <div class="film">
            <a href=${linkURL} target="_blank">
              <img src=${posterURL}>
            </a>
            <span class="filmCaption">${title} (${year})</span>
          </div>`;
      }
    }
  }

  xhr.open('GET', `/getFilms?films=${film}`, true);
  xhr.send();
}
