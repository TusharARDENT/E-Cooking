const api = "https://dummyjson.com/recipes";
let globalData = [];
let currentPage = 1;
let itemsPerPage = 8;
let timer;
const pageListItem = document.querySelector(".pg-listItem");
let paginationContainer = document.querySelector(".pagination-list");
const cardContainer = document.querySelector(".cardList");
const searchBox = document.querySelector(".searchBox");
const modal = document.querySelector(".modal");
const body = document.querySelector("body");
const header = document.querySelector("header");
const button = document.querySelector(".closeButton");
console.log(modal);

searchBox.addEventListener("input", debounce);
button.addEventListener("click", removeModal);

const swiper = new Swiper(".swiper", {
  direction: "vertical",
  loop: true,
  pagination: { el: ".swiper-pagination" },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  scrollbar: { el: ".swiper-scrollbar" },
});

// Fetch data from the API and initialize
async function getData() {
  try {
    let res = await fetch(`${api}?sortBy=name&order=asc`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await res.json();
    globalData = data.recipes;
    console.log(globalData);
    pagination(); // Initialize pagination after data is fetched
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("There was an issue fetching the data. Please try again later.");
  }
}

// Function to handle modal closing
function removeModal() {
  cardContainer.classList.remove("blurBg");
  paginationContainer.classList.remove("blurBg");
  header.classList.remove("blurBg");
  modal.classList.remove("show");
  body.style.overflow = "auto"; // Allow scrolling again
}

// Debounce function to handle search input
function debounce() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    searchOutput();
  }, 500); // Reduced debounce time for quicker responsiveness
}

// Function to update the DOM based on the current page (pagination)
async function updateDOM(limit, skip) {
  cardContainer.innerHTML = ""; // Clear current cards

  // Request data for the current page
  let res = await fetch(`${api}?limit=${limit}&skip=${skip}`);
  let data = await res.json();
  console.log(data);

  // Loop through recipes and create card elements
  data.recipes.forEach((recipe) => {
    const cardItem = document.createElement("li");
    cardItem.className = "cardListItem";

    cardItem.innerHTML = `
      <div class="swiffy-slider slider-item-helper">
        <ul class="slider-container">
          <li><figure><img src="${recipe.image}" alt="${recipe.name}"></figure></li>
          <li><figure><img src="${recipe.image}" alt="${recipe.name}"></figure></li>
          <li><figure><img src="${recipe.image}" alt="${recipe.name}"></figure></li>
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
    cardItem.addEventListener("click", () => cardDetails(id));
  });
}

// Function to handle showing recipe details in a modal
async function cardDetails(id) {
  let res = await fetch(`${api}/${id}`);
  let data = await res.json();
  console.log(data, data.ingredients, data.cuisine);

  modal.innerHTML = ""; // Clear previous modal content

  const cardItem = document.createElement("li");
  cardItem.className = "displayCard";
  modal.classList.add("show");

  cardItem.innerHTML = `
    <div class="buttonDiv">
      <button class="closeButton">x</button>
    </div>
    <div class="modalHeading">
      <div class="swiffy-slider slider-item-helper">
        <ul class="slider-container">
          <li><figure><img src="${data.image}" alt="${data.name}"></figure></li>
          <li><figure><img src="${data.image}" alt="${data.name}"></figure></li>
          <li><figure><img src="${data.image}" alt="${data.name}"></figure></li>
        </ul>
      </div>
      <div class="cardHeading">
        <h4 class="cardTitle">${data.name}</h4>
        <span class="cookName">${data.cuisine}</span>
        <span class="cardTag">${data.difficulty}</span>
      </div>
    </div>
    <div class="displayInfo">
      <span class="ingredients">INGREDIENTS: ${data.ingredients}</span>
      <span class="instructions">INSTRUCTIONS: ${data.instructions}</span>
      <span class="servings">No of Servings: ${data.servings}</span>
      <span class="prepTime">Time to Prepare: ${data.prepTimeMinutes}</span>
      <span class="cookTime">Time to Cook: ${data.cookTimeMinutes}</span>
      <div class="timeEstimation">
        <span class="difficulty">Difficulty: ${data.difficulty}</span>
      </div>
    </div>
  `;

  cardContainer.classList.add("blurBg");
  paginationContainer.classList.add("blurBg");
  header.classList.add("blurBg");
  body.style.overflow = "hidden"; // Disable scrolling

  modal.appendChild(cardItem);
  document.querySelector(".closeButton").addEventListener("click", removeModal);
}

// Function to handle pagination and update page numbers
async function pagination() {
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(globalData.length / limit);
  console.log(totalPages);

  updateDOM(limit, skip); // Update DOM based on current page and items per page

  // Loop to generate pagination buttons
  for (let i = 0; i < totalPages; i++) {
    const pageListItem = document.createElement("li");
    pageListItem.className = `pg-listItem pg${i + 1}`;
    pageListItem.innerHTML = `${i + 1}`;

    if (i === currentPage - 1) {
      pageListItem.classList.add("pg-listItem-active");
    }

    paginationContainer.appendChild(pageListItem);

    pageListItem.onclick = () => {
      currentPage = i + 1; // Set the new current page
      pagination(); // Re-render pagination based on the selected page
    };
  }
}

// Function to handle search and show results
async function searchOutput() {
  const input = searchBox.value.toLowerCase();

  if (input === "") {
    pagination(); // Reset pagination if input is empty
  } else {
    console.log(input);
    cardContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    let res = await fetch(`${api}/search?q=${input}`);
    let data = await res.json();

    if (data.recipes.length === 0) {
      alert("No recipes found!"); // Handle empty search results
    } else {
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
        cardItem.addEventListener("click", () => cardDetails(id));
      });
    }
  }
}

// Initial data fetch
getData();
