const api = "https://dummyjson.com/recipes?limit=12";
let globalData;

async function getdata() {
  // Fetch data
  await fetch(api)
    .then((res) => res.json())
    .then((data) => {
      globalData = data.recipes;
      console.log(globalData);
      updateDOM();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function updateDOM() {
  const cardContainer = document.querySelector(".cardList");
  cardContainer.innerHTML = "";
  //forEach Loop
  globalData.forEach((recipe) => {
    const cardItem = document.createElement("li");
    cardItem.className = "cardListItem";

    cardItem.innerHTML = `
      <figure>
        <img src="${recipe.image}" alt="${recipe.name}">
      </figure>
      <div class="cardDesc">
        <div class="cardHeading">
          <h4 class="cardTitle">${recipe.name}</h4>
          <span class="cookName">${recipe.cuisine}</span>
          <span class="cardTag">${recipe.difficulty}</span>
        </div>
        <div class="timeEstimation">
          <span class="timeToPrepare">${recipe.prepTimeMinutes} min | ${recipe.rating} / 5.0 | ${recipe.reviewCount} reviews</span>
          <span class="saveIcon"><span>Save Icon</span></span>
        </div>
      </div>
    `;

    cardContainer.appendChild(cardItem);
  });
}

getdata();
