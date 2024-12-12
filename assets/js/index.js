const api = "https://dummyjson.com/recipes";
let globalData = [];
const pageListItem = document.querySelector(".pg-listItem");
let paginationContainer = document.querySelector(".pagination-list");
const cardContainer = document.querySelector(".cardList");
const searchBox = document.querySelector(".searchBox");
let itemsPerPage = 8;
let currentPage = 1;
let timer;

searchBox.addEventListener("input", debounce);

function debounce() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    searchOutput();
  }, 1000);
}

async function getdata() {
  try {
    let res = await fetch(`${api}?sortBy=name&order=asc`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    globalData = data.recipes;
    console.log(globalData);
    pagination();
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("There was an issue fetching the data. Please try again later.");
  }
}

async function updateDOM(limit, skip) {
  cardContainer.innerHTML = "";

  let res = await fetch(`${api}?limit=${limit}&skip=${skip}`);
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
    const id = recipe.id;
    cardItem.addEventListener("click", ()=> cardDetails(id))
  });
}

async function cardDetails(id){
  let res = await fetch(`${api}/${id}`)
  let data = await res.json();
  console.log(data, data.ingredients, data.cuisine)
  paginationContainer.innerHTML = "";
  
  cardContainer.className = "displayDetail"
  const cardItem = document.createElement("li");
  // cardItem.removeEventListener("click", ()=> cardDetails(id))
  cardItem.className = "displayCard";

  cardItem.innerHTML = `
    <figure>
      <img src="${data.image}" alt="${data.name}" class = "displayImage">
    </figure>
    <div class="cardDesc">
      <div class="cardHeading">
        <h4 class="cardTitle">${data.name}</h4>
        <span class="cookName">${data.cuisine}</span>
        <span class="cardTag">${data.difficulty}</span>
        
      </div>
      <div class="timeEstimation">
        <span class="timeToPrepare">${data.prepTimeMinutes} min | ${data.rating} / 5.0 | ${data.reviewCount} reviews</span>
        <span class="saveIcon"><span>Save Icon</span></span>
      </div>
    </div>
  `;
  cardContainer.appendChild(cardItem);

}

async function pagination() {
  let limit = 12;
  let skip = 0;

  paginationContainer.innerHTML = "";
  let totalPages = Math.ceil(globalData.length / limit);
  console.log(totalPages);
  updateDOM(limit, skip);

  for (let i = 0; i < totalPages; i++) {
    const pageListItem = document.createElement("li");
    pageListItem.className = `pg-listItem pg${i + 1}`;
    pageListItem.innerHTML = `${i + 1}`;
    if (i === 0) {
      pageListItem.classList.add("pg-listItem-active");
    }
    paginationContainer.appendChild(pageListItem);

    pageListItem.onclick = () => {
      paginationContainer.querySelectorAll(".pg-listItem").forEach((item) => {
        item.classList.remove("pg-listItem-active");
      });
      pageListItem.classList.add("pg-listItem-active");
      skip = i * limit;
      console.log(skip);
      updateDOM(limit, skip);
    };
  }
}

async function searchOutput() {
  const input = searchBox.value.toLowerCase();

  if(input == ""){
    pagination();
  }else{
  console.log(input);
  cardContainer.innerHTML = "";
  paginationContainer.innerHTML = "";
  let res = await fetch(`${api}/search?q=${input}`);
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
        const id = recipe.id;
        cardItem.addEventListener("click", ()=> cardDetails(id))
  });
}
}

getdata();
