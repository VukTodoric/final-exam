import { FetchApi } from "./service.js";

let loginPage = document.getElementById("loginPage"),
  homePage = document.getElementById("homePage"),
  loginBtn = document.getElementById("loginBtn"),
  logoutBtn = document.getElementById("logoutBtn"),
  menuBtn = document.getElementById("menuBtn"),
  homeNav = document.getElementById("homeNav"),
  worklogNav = document.getElementById("worklogNav"),
  navMenu = document.getElementById("navMenu"),
  tableBody = document.getElementById("tableBody"),
  firstNameLogin = document.getElementById("firstNameLogin"),
  lastNameLogin = document.getElementById("lastNameLogin"),
  emailLogin = document.getElementById("emailLogin"),
  passwordLogin = document.getElementById("passwordLogin"),
  formLogin = document.getElementById("formLogin"),
  userName = document.getElementById("userName"),
  emailSearch = document.getElementById("emailSearch"),
  logoutModal = document.getElementById("logoutModal"),
  yesBtn = document.getElementById("yesBtn"),
  noBtn = document.getElementById("noBtn"),
  employee = document.getElementsByClassName("employee"),
  singePageModal = document.getElementById("singePageModal"),
  singePageModalContetnt = document.getElementById("singePageModalContetnt"),
  exitBtn = document.getElementsByClassName("exitBtn"),
  homePageContent = document.getElementById("homePageContent"),
  worklogPage = document.getElementById("worklogPage"),
  tableBodyWorklog = document.getElementById("tableBodyWorklog");

const URl_LOCAL = "http://localhost:3000";

menuBtn.addEventListener("click", function () {
  navMenu.classList.toggle("display-none");
});

worklogNav.addEventListener("click", function () {
  worklogPage.classList.remove("display-none");
  homePageContent.classList.add("display-none");

  FetchApi.getMethodGet(URl_LOCAL + "/employee/").then(function (data) {
    console.log(data);
    tableBodyWorklog.innerHTML = null;
    createWorklogList(data);
  });
});

homeNav.addEventListener("click", function () {
  worklogPage.classList.add("display-none");
  homePageContent.classList.remove("display-none");
});

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();
  homePage.classList.remove("display-none");
  loginPage.classList.add("display-none");
  userName.innerText = firstNameLogin.value + " " + lastNameLogin.value;

  FetchApi.getMethodGet(
    `http://localhost:3000/employee?firstNameLogin=${firstNameLogin.value}&lastNameLogin=${lastNameLogin.value}&emailLogin=${emailLogin.value}&passwordLogin=${passwordLogin.value}`
  ).then(function (data) {
    console.log(data.length);
    createList(data);
    openEmployeePage();
  });
});

emailSearch.addEventListener("keyup", function () {
  FetchApi.getMethodGet(
    URl_LOCAL + "/employee?email_like=",
    emailSearch.value
  ).then(function (data) {
    console.log(data);
    tableBody.innerText = null;
    createList(data);
    openEmployeePage();
  });
});

function createList(response) {
  for (let employee of response) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML += `
    <td><img src=" ${employee.image}" class='avatar-photo'> </td>
    <td><a href= '#' class="employee" data-employeeId="${employee.id}">${employee.first_name} ${employee.last_name}</a></td>
    <td><a href= '#' class="employee" data-employeeId="${employee.id}">${employee.email}</a></td>
      <td>${employee.position}</td>
      <td>${employee.description}</td>
      <td>${employee.employment_date}</td>
      `;
    tableBody.appendChild(tableRow);
  }
}

function createWorklogList(response) {
  for (let employee of response) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML += `
    <td> ${employee.id}</td>
    <td><a href= '#' class="employee" data-employeeId="${employee.id}">${
      employee.first_name
    } ${employee.last_name}</a></td>
    <td>${employee.work_date}</td>
      <td>${employee.logged_hours}</td>
      <td>${employee.task}</td>
      <td>${employee.comment}</td>
      <td>${employee.free_day ? "Yes" : "No"}</td>
      <td>${employee.overtime}</td>
      `;
    tableBodyWorklog.appendChild(tableRow);
  }
}

function openEmployeePage() {
  for (let employeeId of employee) {
    employeeId.addEventListener("click", function (event) {
      const id = event.target.getAttribute("data-employeeId");
      singePageModal.classList.remove("display-none");
      FetchApi.getMethodGet(URl_LOCAL + "/employee/", id).then(function (data) {
        singePageModalContetnt.innerHTML += `
        <div class="exit-wrapper">
        <button type="button" class="custom-btn exitBtn">X</button>
        </div>
        <div class="image-wrapper"><img src="${data.image}" /></div>
        <div class="data-wrapper">
        <h2>${data.first_name} ${data.last_name}</h2>
        <p>${data.description}</p>
        <p>${data.employment_date}</p>
        </div>
        `;
        for (let exit of exitBtn) {
          exit.addEventListener("click", function () {
            singePageModal.classList.add("display-none");
            singePageModalContetnt.innerHTML = null;
          });
        }
      });
    });
  }
}

logoutBtn.addEventListener("click", function () {
  logoutModal.classList.remove("display-none");
  noBtn.addEventListener("click", function () {
    logoutModal.classList.add("display-none");
  });
  yesBtn.addEventListener("click", function () {
    homePage.classList.add("display-none");
    loginPage.classList.remove("display-none");
    logoutModal.classList.add("display-none");
    tableBody.innerText = null;
    resetFields(formLogin);
  });
});

function resetFields(list) {
  for (let item of list) {
    item.value = null;
  }
}

function Credentials(first_name, last_name, email, password) {
  this.first_name = first_name.value;
  this.last_name = last_name.value;
  this.email = email.value;
  this.password = password.value;
}
