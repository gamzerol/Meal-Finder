class Recipe {
  constructor() {}
  async getApi(input) {
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`;
    const data = await fetch(url);
    const response = await data.json();
    return response;
  }
  async getSingleMealDetails(id) {
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const data2 = await fetch(url);
    const response2 = await data2.json();
    return response2.meals[0];
  }
  async getRandomMeal() {
    let url = `https://www.themealdb.com/api/json/v1/1/random.php`;
    const random = await fetch(url);
    const response3 = await random.json();
    return response3.meals[0];
  }
}

class UI {
  constructor() {
    this.container = document.querySelector(".container");
    this.results = document.querySelector(".results");
    this.singleMealSection = document.querySelector(".single-meal");
  }
  showMeals(data) {
    let meals = data.meals;
    let resultCards = "";
    for (let i = 0; i < meals.length; i++) {
      resultCards += `<div class="meal">
                                <img src="${meals[i].strMealThumb}" />
                                <div class="meal-info" data-mealid="${meals[i].idMeal}">
                                    <h3>${meals[i].strMeal}</h3>
                                </div>
                            </div>`;
    }
    this.results.innerHTML = resultCards;
  }
  showSingleMeal(singleMeal) {
    let ingradients = [];
    for (let i = 1; i <= 20; i++) {
      if (singleMeal[`strIngredient${i}`]) {
        ingradients.push(
          `${singleMeal[`strIngredient${i}`]} - ${singleMeal[`strMeasure${i}`]}`
        );
      }
    }
    let mealDetail = document.createElement("div");
    mealDetail.className = "inner";
    mealDetail.innerHTML = `<h1 class="meal-name">👩‍🍳 ${singleMeal.strMeal}</h1>
                                <img src="${
                                  singleMeal.strMealThumb
                                }" id="mealImg" />
                                <div class="single-meal-info">
                                    <p>Category: ${singleMeal.strCategory}</p>
                                    <p>Area: ${singleMeal.strArea}</p>
                                </div>
                                <div class="main">
                                    <p>${singleMeal.strInstructions}</p>
                                    <h2>Ingredients</h2>
                                    <ul>
                                        ${ingradients
                                          .map(ing => `<li>${ing}</li>`)
                                          .join("")}
                                    </ul>
                                </div>`;
    this.singleMealSection.appendChild(mealDetail);
  }
}

const searchForm = document.getElementById("searchForm");
const randomMeal = document.getElementById("randomBtn");
const input = document.getElementById("inputMeal");
const header = document.querySelector(".name");
const resultGroup = document.querySelector(".results");

const recipes = new Recipe();
const ui = new UI();

document.addEventListener("DOMContentLoaded", function() {
  header.innerText = "";
});
searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  let meal = input.value;
  header.innerText = `➸ Search results for '${meal}':`;
  recipes
    .getApi(meal)
    .then(data => ui.showMeals(data))
    .catch(error => console.log(error));
});

randomMeal.addEventListener("click", function() {
  ui.singleMealSection.innerHTML = "";
  resultGroup.innerHTML = "";
  recipes
    .getRandomMeal()
    .then(data => ui.showSingleMeal(data))
    .catch(error => console.log(error));
});

resultGroup.addEventListener("click", function(event) {
  ui.singleMealSection.innerHTML = "";
  let mealId = event.target.dataset.mealid;
  recipes
    .getSingleMealDetails(mealId)
    .then(data => ui.showSingleMeal(data))
    .catch(error => console.log(error));
});
