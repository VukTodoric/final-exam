import { FetchApi } from "./service.js";
import { resetFields, exitModal, renderSelect } from "./shared.js";
import { LoggDetails } from "./model.js";
import { URl_LOCAL } from "./enviroment.js";

let loginPage = document.getElementById("loginPage"),
  homePage = document.getElementById("homePage"),
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
  homePageContent = document.getElementById("homePageContent"),
  worklogPage = document.getElementById("worklogPage"),
  tableBodyWorklog = document.getElementById("tableBodyWorklog"),
  createWorklogBtn = document.getElementById("createWorklogBtn"),
  createWorklogPageModal = document.getElementById("createWorklogPageModal"),
  createWorklogModalContent = document.getElementById(
    "createWorklogModalContent"
  ),
  formCreate = document.getElementById("formCreate"),
  empolyeeSelect = document.getElementById("empolyeeSelect"),
  task = document.getElementById("task"),
  editLinks = document.getElementsByClassName("edit"),
  comment = document.getElementById("comment"),
  workDate = document.getElementById("workDate"),
  freeDay = document.getElementById("freeDay"),
  loggedHours = document.getElementById("loggedHours"),
  updateBtn = document.getElementById("updateBtn");

let employeeArray = [];
let worklogArray = [];

FetchApi.getMethodGet(URl_LOCAL + "/employee/").then(function (data) {
  for (let employees of data) {
    employeeArray.push(employees);
  }
});

FetchApi.getMethodGet(URl_LOCAL + "/worklog/").then(function (data) {
  for (let worklogs of data) {
    worklogArray.push(worklogs);
  }
});

menuBtn.addEventListener("click", function () {
  navMenu.classList.toggle("display-none");
});

worklogNav.addEventListener("click", function () {
  worklogPage.classList.remove("display-none");
  homePageContent.classList.add("display-none");
  tableBodyWorklog.innerHTML = null;
  FetchApi.getMethodGet(URl_LOCAL + "/worklog/").then(function (data) {
    createWorklogList(data);
    edit();
  });
});

homeNav.addEventListener("click", function () {
  worklogPage.classList.add("display-none");
  homePageContent.classList.remove("display-none");
});

createWorklogBtn.addEventListener("click", function (event) {
  createWorklogPageModal.classList.remove("display-none");
  updateBtn.classList.add("display-none");
  empolyeeSelect.innerHTML = null;
  createBtn.classList.remove("display-none");
  renderSelect(employeeArray, empolyeeSelect);
  resetFields(formCreate);
  exitModal(createWorklogPageModal);
});

formCreate.addEventListener("submit", function (event) {
  if (valid) {
    event.preventDefault();
    createWorklogPageModal.classList.add("display-none");

    FetchApi.getMethodPost(
      URl_LOCAL + "/worklog/",
      new LoggDetails(
        empolyeeSelect,
        workDate,
        freeDay,
        loggedHours,
        task,
        comment
      )
    ).then(function () {
      FetchApi.getMethodGet(URl_LOCAL + "/worklog/").then(function (data) {
        createWorklogModalContent.innerHTML = null;
        tableBodyWorklog.innerHTML = null;
        worklogArray.push(data);
        createWorklogList(data);
      });
    });
  } else {
    event.preventDefault();
  }
});

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();
  if (valid) {
    event.preventDefault();
    homePage.classList.remove("display-none");
    loginPage.classList.add("display-none");
    userName.innerText = firstNameLogin.value + " " + lastNameLogin.value;

    FetchApi.getMethodGet(
      `http://localhost:3000/employee?firstNameLogin=${firstNameLogin.value}&lastNameLogin=${lastNameLogin.value}&emailLogin=${emailLogin.value}&passwordLogin=${passwordLogin.value}`
    ).then(function (data) {
      createList(data);
      openEmployeePage();
    });
  } else {
    event.preventDefault();
  }
});

emailSearch.addEventListener("keyup", function () {
  FetchApi.getMethodGet(
    URl_LOCAL + "/employee?email_like=",
    emailSearch.value
  ).then(function (data) {
    tableBody.innerText = null;
    createList(data);
    openEmployeePage();
  });
});

function createList(response) {
  for (let employee of response) {
    let description = employee.description;
    let shortenDesc = description.substring(0, 40) + "...";
    const tableRow = document.createElement("tr");
    tableRow.innerHTML += `
    <td><img src=" ${employee.image}" class='avatar-photo'> </td>
    <td><a href= '#' class="employee" data-employeeId="${employee.id}">${employee.first_name} ${employee.last_name}</a></td>
    <td><a href= '#' class="employee" data-employeeId="${employee.id}">${employee.email}</a></td>
      <td>${employee.position}</td>
      <td>${shortenDesc}</td>
      <td>${employee.employment_date}</td>
      `;
    tableBody.appendChild(tableRow);
  }
}

function createWorklogList(response) {
  for (let employee of response) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML += `
        <td>${employee.id}</td>
        <td>${employee.employee}</td>
        <td>${employee.work_date}</td>
        <td>${employee.logged_hours}</td>
        <td>${employee.task}</td>
        <td>${employee.comment}</td>
        <td><input type="checkbox" disabled ${
          employee.free_day == true ? "checked" : ""
        }></td>
        <td>${employee.logged_hours > 8 ? "Yes" : "No"}</td>
        <td><button class= "edit custom-btn"  data-employeeId="${
          employee.id
        }">Edit</button></td>
        `;
    tableBodyWorklog.appendChild(tableRow);
  }
}

function edit() {
  for (let editLink of editLinks) {
    editLink.addEventListener("click", function (event) {
      const id = event.target.getAttribute("data-employeeId");
      FetchApi.getMethodGet(URl_LOCAL + "/worklog/", id).then(function (
        worklog
      ) {
        empolyeeSelect.value = worklog.employee;
        workDate.value = worklog.work_date;
        freeDay.value = worklog.free_day;
        loggedHours.value = worklog.logged_hours;
        task.value = worklog.task;
        comment.value = worklog.comment;
        createWorklogPageModal.classList.remove("display-none");
        updateBtn.classList.remove("display-none");
        createBtn.classList.add("display-none");
        updateBtn.setAttribute("data-employeeId", worklog.id);
        renderSelect(employeeArray, empolyeeSelect);
        exitModal(createWorklogPageModal);
        updateBtn.addEventListener("click", function () {
          const id = event.target.getAttribute("data-employeeId");
          FetchApi.getMethodPut(
            URl_LOCAL + "/worklog/",
            new LoggDetails(
              empolyeeSelect,
              workDate,
              freeDay,
              loggedHours,
              task,
              comment
            ),
            id
          ).then(function () {
            updateBtn.classList.add("display-none");
            createBtn.classList.remove("display-none");
            createWorklogPageModal.classList.add("display-none");
            FetchApi.getMethodGet(URl_LOCAL + "/worklog/").then(function (
              data
            ) {
              tableBodyWorklog.innerHTML = null;
              createWorklogList(data);
              resetFields(formCreate);
            });
          });
        });
      });
    });
  }
}

function openEmployeePage() {
  for (let employeeId of employee) {
    employeeId.addEventListener("click", function (event) {
      const id = event.target.getAttribute("data-employeeId");
      singePageModal.classList.remove("display-none");
      FetchApi.getMethodGet(URl_LOCAL + "/employee/", id).then(function (data) {
        let filterArr = worklogArray.filter(
          (f) => f.employee == data.first_name + " " + data.last_name
        );

        let renderFiltered = "";
        filterArr.forEach(
          (el) =>
            (renderFiltered += `
        <tr>
        <td>${el.work_date}</td>
        <td>${el.logged_hours == 0 ? "Free Day" : el.logged_hours}</td>
        </tr>
        `)
        );
        tableBodyWorklog.innerHTML = renderFiltered;
        singePageModalContetnt.innerHTML += `
        <div class="exit-wrapper">
        <button type="button" class="custom-btn exitBtn">X</button>
        </div>
        <div class="employee-wrapper">
        <div class="image-wrapper"><img src="${data.image}" /></div>
        <div class="data-wrapper">
        <h2 ><span class="strong">Full name:</span> ${data.first_name} ${data.last_name}</h2>
        <p><span class="strong">Description:</span> ${data.description}</p>
        <p><span class="strong">Employment date:</span> ${data.employment_date}</p>
        <table>
        <thead>
        <tr>
        <th>Work date</th>
        <th>Logged Hours</th>  
        </tr>
        </thead>
        <tbody id="tableBodyWorklog">${renderFiltered}</tbody>
        </table>
        </div>
        <div/>      
                `;
        exitModal(singePageModal, singePageModalContetnt);
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
    valid = false;
    tableBody.innerText = null;
    resetFields(formLogin);
  });
});

let valid = false;
firstNameLogin.addEventListener("keyup", function () {
  if (firstNameLogin.value.length === 0) {
    valid = false;
    firstNameLogin.classList.add("invalid");
  } else {
    valid = true;
    firstNameLogin.classList.remove("invalid");
  }
});
lastNameLogin.addEventListener("keyup", function () {
  if (lastNameLogin.value.length === 0) {
    valid = false;
    lastNameLogin.classList.add("invalid");
  } else {
    valid = true;
    lastNameLogin.classList.remove("invalid");
  }
});

emailLogin.addEventListener("keyup", function () {
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isEmailValid = regexEmail.test(emailLogin.value);
  if (!isEmailValid) {
    valid = false;
    emailLogin.classList.add("invalid");
  } else {
    valid = true;
    emailLogin.classList.remove("invalid");
  }
});
passwordLogin.addEventListener("keyup", function () {
  if (passwordLogin.value.length < 5) {
    valid = false;
    passwordLogin.classList.add("invalid");
  } else {
    valid = true;
    passwordLogin.classList.remove("invalid");
  }
});

empolyeeSelect.addEventListener("click", function () {
  if (empolyeeSelect.value.length === 0) {
    valid = false;
    empolyeeSelect.classList.add("invalid");
  } else {
    valid = true;
    empolyeeSelect.classList.remove("invalid");
  }
});

freeDay.addEventListener("click", function () {
  if (freeDay.checked) {
    loggedHours.value = 0;
  }
});

loggedHours.addEventListener("keyup", function () {
  const regexHours = /^\d+$/;
  const isHoursValid = regexHours.test(loggedHours.value);

  if (loggedHours.value < 0 || !isHoursValid) {
    valid = false;
    loggedHours.classList.add("invalid");
  } else {
    valid = true;
    loggedHours.classList.remove("invalid");
  }
});

task.addEventListener("keyup", function () {
  const regexTask = /^[A-Z]/;
  const isTaskValid = regexTask.test(task.value);
  if (!isTaskValid) {
    valid = false;
    task.classList.add("invalid");
  } else {
    valid = true;
    task.classList.remove("invalid");
  }
});

comment.addEventListener("keyup", function () {
  const regexComment = /^.{0,250}$/;
  const isComentValid = regexComment.test(comment.value);
  if (!isComentValid) {
    valid = false;
    comment.classList.add("invalid");
  } else {
    valid = true;
    comment.classList.remove("invalid");
  }
});
