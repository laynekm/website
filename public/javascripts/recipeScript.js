function getRecipes() {

  //read in from ingredient input field, verify it has been populated
  let ingredients = document.getElementById('ingredient').value;
  if(!ingredients){return alert('Please enter ingredient(s)!');}
  let ingredientDiv = document.getElementById('recipes');
  ingredientDiv.innerHTML = '';

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
      ingredientDiv.innerHTML = ingredientDiv.innerHTML +
      `<h1> Found ${response.count} recipes for ${ingredients} </h1>`;

      //iterate through and add div  with title, image, link for each recipe
      let recipes = response.recipes;
      for(let x in recipes){
        let imageURL = recipes[x].image_url;
        let linkURL = recipes[x].source_url;
        let title = recipes[x].title;

        ingredientDiv.innerHTML = ingredientDiv.innerHTML + `
          <div class="recipe">
            <a href=${linkURL} target="_blank">
              <img src=${imageURL}>
            </a>
            <span class="recipeCaption">${title}</span>
          </div>`;
      }
    }
  }

  xhr.open('GET', `/getRecipes?ingredients=${ingredients}`, true);
  xhr.send();
}
