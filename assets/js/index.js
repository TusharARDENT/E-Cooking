const api = "https://dummyjson.com/recipes";
let globalData = [];
const pageListItem = document.querySelector(".pg-listItem");
let paginationContainer = document.querySelector(".pagination-list");
const cardContainer = document.querySelector(".cardList");
const searchBox = document.querySelector(".searchBox");
let itemsPerPage = 8;
let currentPage = 1;

searchBox.addEventListener("input", searchOutput)

async function getdata() {
  // Fetch data
  await fetch(api)
    .then((res) => res.json())
    .then((data) => {
      globalData = data.recipes;
      console.log(globalData);
      pagination();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

async function updateDOM(limit, skip) {
  cardContainer.innerHTML = "";

  let res = await fetch(`${api}?limit=${limit}&skip=${skip}`)
  let data = await res.json();
  console.log(data);

  data.recipes.forEach((recipe) => {
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

async function pagination() {
    let limit = 12;
    let skip = 0;
    let res = await fetch(`${api}?limit=${limit}&skip=${skip}`)
    let data = await res.json();
    console.log(data);
    paginationContainer.innerHTML = "";
    let totalPages = Math.ceil(globalData.length / itemsPerPage);
    console.log(totalPages);
    updateDOM(limit, skip)


        for(let i = 0; i < totalPages; i++){
            const pageListItem = document.createElement("li");
            pageListItem.className = `pg-listItem pg${i+1}`;
            pageListItem.innerHTML =`${i+1}`;
            paginationContainer.appendChild(pageListItem);
            pageListItem.onclick = () => {
                skip = i * limit;
                console.log(skip);
                pageListItem.classList.remove("pg-listItem-active");
                updateDOM(limit, skip)
            };
            currentPage = i + 1;
            pageListItem.classList.add("pg-listItem-active");
            };
  };

  async function searchOutput(){
    const input = searchBox.value.toLowerCase();
    console.log(input);
    cardContainer.innerHTML = "";
    let res = await fetch(`${api}/search?q=${input}`)
    let data = await res.json();

    data.recipes.forEach((recipe) => {
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

