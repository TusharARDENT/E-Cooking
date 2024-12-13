const api = "https://dummyjson.com/recipes";
let globalData = [];
const pageListItem = document.querySelector(".pg-listItem");
let paginationContainer = document.querySelector(".pagination-list");
const cardContainer = document.querySelector(".cardList");
const searchBox = document.querySelector(".searchBox");
const modal = document.querySelector(".modal");
const body = document.querySelector("body");
const header = document.querySelector("header");
const button = document.querySelector(".closeButton")
console.log(modal);
let itemsPerPage = 8;
let currentPage = 1;
let timer;
searchBox.addEventListener("input", debounce);
button.addEventListener("click", removeModal)


const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'vertical',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

function removeModal(){
  cardContainer.classList.remove("blurBg")
  paginationContainer.classList.remove("blurBg")
  header.classList.remove("blurBg")
  modal.classList.remove("show")
  body.style.overflow = "hidden"
}

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
    
<div class="swiffy-slider slider-item-helper">
    <ul class="slider-container">
        <li><figure>
                  <img src="${recipe.image}" alt="">
                </figure></li>
        <li><figure>
                  <img src="${recipe.image}" alt="">
                </figure></li>
        <li><figure>
                  <img src="${recipe.image}" alt="">
                </figure></li>
    </ul>
     <button type="button" class="slider-nav"></button>
    <button type="button" class="slider-nav slider-nav-next"></button>
        <div class="slider-indicators">
        <button class="active"></button>
        <button></button>
        <button></button>
    </div>

</div>
    
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
  modal.innerHTML = "";
  
  const cardItem = document.createElement("li");
  cardItem.className = "displayCard";
  modal.classList.add("show")

  cardItem.innerHTML = `
  <div class="modalHeading">
<div class="swiffy-slider slider-item-helper">
    <ul class="slider-container">
        <li><figure>
                  <img src="${data.image}" alt="">
                </figure></li>
        <li><figure>
                  <img src="${data.image}" alt="">
                </figure></li>
        <li><figure>
                  <img src="${data.image}" alt="">
                </figure></li>
    </ul>
</div>
                <div class="cardHeading">
                <div class="buttonDiv">
                  <button class="closeButton">x</button>
                </div>
                  <h4 class="cardTitle">${data.name}</h4>
                  <span class="cookName">${data.cuisine}</span>
                  <span class="cardTag">${data.difficulty}</span>
                </div>
              </div>
              <div class="displayInfo">
                <span class="ingredients">INGREDIENTS : ${data.ingredients}</span>
                <span class="ingredients">INSTRUCTIONS : ${data.instructions}</span>
                <span class="servings">No of Servings : ${data.servings}</span>
                <span class="prepTime">Time to prepare : ${data.prepTimeMinutes}</span>
                <span class="cookTime">Time to cook : ${data.cookTimeMinutes}</span>
                <div class="timeEstimation">
                  <span class="timeToPrepare">Difficulty : ${data.difficulty}</span>
                </div>
              </div>
  `;
  cardContainer.classList.add("blurBg")
  paginationContainer.classList.add("blurBg")
  header.classList.add("blurBg")
  body.style.overflow = "hidden"
  modal.appendChild(cardItem);
  document.querySelector(".closeButton").addEventListener("click", removeModal)
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
