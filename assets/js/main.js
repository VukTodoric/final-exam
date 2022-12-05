let loginPage = document.getElementById("loginPage"),
  homePage = document.getElementById("homePage"),
  loginBtn = document.getElementById("loginBtn"),
  logoutBtn = document.getElementById("logoutBtn"),
  menuBtn = document.getElementById("menuBtn"),
  homeNav = document.getElementById("homeNav"),
  worklogNav = document.getElementById("worklogNav"),
  navMenu = document.getElementById("navMenu");

homePage.classList.add("display-none");
navMenu.classList.add("display-none");

menuBtn.addEventListener("click", function () {
  console.log("click");
  navMenu.classList.toggle("display-none");
});

loginBtn.addEventListener("click", function (event) {
  event.preventDefault();
  homePage.classList.remove("display-none");
  loginPage.classList.add("display-none");
});
