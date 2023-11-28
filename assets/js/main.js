// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

let usersCount = document.querySelector("#users-count");
let ordersCount = document.querySelector("#orders-count");
let productsCount = document.querySelector("#products-count");
axios.defaults.baseURL = "http://localhost:3000";

const wait = (delay) => new Promise((res) => setTimeout(res, delay));
const displayStat = async function (data, element) {
  for (let i = 1; i <= data.length; i++) {
    await wait(100);
    element.innerHTML = i;
  }
}

async function nam() {
  let users = await axios.get("/users");
  let orders = await axios.get("/orders");
  let products = await axios.get("/products");
  displayStat(users.data, usersCount);
  displayStat(orders.data, ordersCount);
  displayStat(products.data, productsCount);
};

nam()
