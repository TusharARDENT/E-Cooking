// Functionality of the page should appear here\


// async function myFunction(i) {
//     const data = await fetch('https://dummyjson.com/recipes?limit=10&Skip=10&select=name')
//     .then(res => res.json())
//     console.log("myfunction",data.recipes[i]);
// }

// myFunction();

// IIFE - IMMEDIATE INVOKE FUNCTION EXPRESSION

// const APICALLING = ASYNC () => {
    
// }

// fetch('https://dummyjson.com/recipes')
// .then(res => res.json())
// .then(console.log);

// async function getData() {
//     const url = "https://dummyjson.com/recipes";
//           const response = await fetch(url);

//       const json = await response.json();
//       console.log(json.recipes[17]);
//   }

// getData();

// fetch("https://dummyjson.com/recipes")
// .then(response => console.log(response))
// .catch(error => console.log(error))

const cardTitle = document.querySelectorAll(".cardTitle");
const cardListItem = document.querySelectorAll(".cardListItem");
const prepTime = document.querySelectorAll(".timeToPrepare");
const cuisine = document.querySelectorAll(".cookName");
const difficulty = document.querySelectorAll(".cardTag");
const images = document.querySelectorAll("img")

console.log(images);

async function apiCall() {
    const data = await fetch('https://dummyjson.com/recipes');
    const resp = await data.json();
    // console.log("apicall", resp);

    const { recipes } = resp;
    console.log(recipes);

    for (let i = 0; i < 30; i++) {
        cardTitle[i].innerHTML = recipes[i].name;
        cuisine[i].innerHTML = recipes[i].cuisine;
        prepTime[i].innerHTML = recipes[i].prepTimeMinutes + " min Ratings:" + recipes[i].rating + "/5";
        difficulty[i].innerHTML = recipes[i].difficulty;
        images[i].src = recipes[i].image;

        console.log(difficulty[i])
    }
}

apiCall();
