const api = "https://dummyjson.com/recipes";
let globalData = [];
const pageListItem = document.querySelectorAll(".pg-listItem");
const paginationList = document.querySelector(".pagination-list")
const cardContainer = document.querySelector(".cardList");
const paginationContainer = document.querySelector(".pagination");
const searchBox = document.querySelector(".searchBox");
let itemsPerPage = 8;
let currentPage = 1;

console.log(searchBox);
function searchBoxTest(event){
    console.log(searchBox.value);
}

searchBoxTest();
async function getdata() {
  // Fetch data
  await fetch(api)
    .then((res) => res.json())
    .then((data) => {
      globalData = data.recipes;
      console.log(globalData);
      updateDOM();
      pagination();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function updateDOM(startIndex, endIndex) {
  cardContainer.innerHTML = "";
//   paginationContainer.innerHTML = "";
  let totalPages = Math.ceil(globalData.length / itemsPerPage);

    // Calculate start and end indices for the current page
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = Math.min(startIndex + itemsPerPage, globalData.length);
   
    // Add items for the current page
    globalData.slice(startIndex, endIndex).forEach((recipe) => {
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

  //Add pagination list
//   paginationList.forEach((index) => {
//     // listItem.className = "cardListItem";
//     pageListItem.innerHTML = `<li class="pg-listItem">${index + 1}</li>`
//     paginationContainer.appendChild(pageListItem)
// });

}

getdata();
function pagination() {
    pageListItem.forEach((element, index) => {

                // Handle previous page button
        // prevPageButton.onclick = () => {
        //     pageListItem.forEach((element) => {
        //         element.classList.remove("pg-listItem-active");
        //     });
        //     if (currentPage > 1) {
        //       currentPage--;  
        //       updateDOM();    
        //       prevPageButton.classList.add("pg-listItem-active")
        //     }
        //   };

        element.onclick = () => {
            pageListItem.forEach((element) => {
                element.classList.remove("pg-listItem-active");
            });
            currentPage = index+1;
            updateDOM()
            element.classList.add("pg-listItem-active")
        } 

            // Handle next page button
    // nextPageButton.onclick = () => {
    //     if (currentPage < totalPages) {
    //       currentPage++; 
    //       updateDOM();   
    //     }
    //   };
    });
   
  }
  