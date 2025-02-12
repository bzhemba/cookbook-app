const recipes_container = document.querySelector(".recipes_container");
const fetchApi = async (query) => {
    recipes_container.innerHTML = `
  <img src="/images/loading.gif" class="loader_img" />`;

    try {
        await fakeDelay(2000);
        const randomFilter = Math.random() < 0.5;

        if (randomFilter) {
            query = String.fromCharCode(Math.floor(Math.random() * 13) + 65);
        } else {
            query = String.fromCharCode(Math.floor(Math.random() * 13) + 78);
        }


        const requestApi = await fetch(
            ` https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

        const response = await requestApi.json();
        console.log(response);

        await showdata(response);
    } catch (er) {
        recipes_container.innerHTML =
            "<h1 class='errormsg'> something went wrong </h1>";
        console.log(er);
    }
};

function fakeDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const showdata = async (resp) => {
    try {
        recipes_container.innerHTML = "";

        const result = await resp.meals;

        result.map((value) => {
            const {strMealThumb, strMeal, strArea, strCategory} = value;

            var recipe_card = document.createElement("div");

            recipe_card.setAttribute("class", "recipe_card");

            recipe_card.innerHTML = `
          <img src= ${strMealThumb} />
          <div class="recipe_description">
            <h2> ${strMeal}</h2>
            <h3>  <span> ${strArea} </span>  dish</h3>
            <h5> belongs to <span> ${strCategory}</span> category </h5>
            </div>
      `;

            recipes_container.appendChild(recipe_card);
        });
    } catch (err) {
        recipes_container.innerHTML =
            "<h1 class='errormsg'> recipes not found </h1>";
    }
};

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('filter');
    fetchApi(param);
});
