//declaring global variables
const searchBtn = document.getElementById("search-btn");
const mealsEl = document.getElementById("meals");
const favMeals = document.getElementById("fav-meals");
const mealPopup = document.getElementById("meal-popup");
const mealInfo = document.getElementById("meal-info");
const closeMenuBtn = document.getElementById("close-menu");

//function to get random meal
const getRandomMeal = async () => {
  const random = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const randomData = await random.json();
  const randomMeal = randomData.meals[0];

  addMeal(randomMeal, true);
};
getRandomMeal();

const getMealById = async (id) => {
  const random = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const randomData = await random.json();
  const meal = randomData.meals[0];
  return meal;
};

//function to search for meals
const getMealsBySearch = async (term) => {
  const random = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const randomData = await random.json();
  const meals = randomData.meals;
  return meals;
};

const addMeal = (mealData, random = false) => {
  //console.log(mealData);
  //creating a new html element
  const meal = document.createElement("div");
  //adding className to meal div
  meal.classList.add("meal");
  //adding other elements to meal div
  meal.innerHTML = ` 
          <div class="meal-header">
          ${random ? `<span class="random">Random Recipe</span>` : ""}
            <img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"
            />
          </div>
          <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        `;
  //btn function for clicking event
  const mealBtn = meal.querySelector(".meal-body .fav-btn");
  mealBtn.addEventListener("click", () => {
    //targeting the active class to toggle the button color
    if (mealBtn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      mealBtn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      mealBtn.classList.add("active");
    }
    addMealToFav(mealData);
  });
  meal.addEventListener("click", () => {
    showMealinfo(mealData);
  });
  //appending meal div to meals div
  mealsEl.appendChild(meal);
};

//all three functions are to make favorite btn clickable
const addMealLS = (mealId) => {
  const mealIds = getMealsFromLS();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
};

const removeMealLS = (mealId) => {
  const mealIds = getMealsFromLS();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
};

const getMealsFromLS = () => {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
};

const fetchFavMeals = async () => {
  //cleaning section
  favMeals.innerHTML = "";
  const mealIds = getMealsFromLS();
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    let meal = await getMealById(mealId);
    addMealToFav(meal);
  }
};
fetchFavMeals();

const addMealToFav = (mealData) => {
  //creating favorite section list
  const favMeal = document.createElement("li");
  favMeal.innerHTML = `<img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"/>
            <span>${mealData.strMeal}</span>
            <button class="clear"><i class="fas fa-window-close"></i></button>
            `;

  const clearBtn = favMeal.querySelector(".clear");
  clearBtn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);
    fetchFavMeals();
  });
  //appending meal div to meals div
  favMeals.appendChild(favMeal);
};

//meal info section function
const showMealinfo = (mealData) => {
  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }
  mealInfo.innerHTML = `
  <h2>${mealData.strMeal}</h2>
          <img
            src="${mealData.strMealThumb}"
            alt=""
          />
          <p>
          ${mealData.strInstructions}
          </p>
           <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
        </ul>
  `;
};

//search menu function
searchBtn.addEventListener("click", async () => {
  mealsEl.innerHTML = "";
  const searchInput = document.getElementById("search-input").value;
  const meals = await getMealsBySearch(searchInput);

  meals.forEach((meal) => {
    addMeal(meal);
  });
});

//recipe close function
closeMenuBtn.addEventListener("click", () => {
  mealInfo.innerHTML = "";
});
