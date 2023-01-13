import { FetchApi } from "./service.js";
import {
  resetFields,
  exitModal,
  renderSelect,
  displayWarning,
} from "./shared.js";
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
  emailLogin = document.getElementById("emailLogin"),
  passwordLogin = document.getElementById("passwordLogin"),
  formLogin = document.getElementById("formLogin"),
  userName = document.getElementById("userName"),
  emailSearch = document.getElementById("emailSearch"),
  logoutModal = document.getElementById("logoutModal"),
  yesBtn = document.getElementById("yesBtn"),
  noBtn = document.getElementById("noBtn"),
  employee = document.getElementsByClassName("employee"),
  singePageModalContetnt = document.getElementById("singePageModalContetnt"),
  homePageContent = document.getElementById("homePageContent"),
  worklogPage = document.getElementById("worklogPage"),
  tableBodyWorklog = document.getElementById("tableBodyWorklog"),
  createWorklogBtn = document.getElementById("createWorklogBtn"),
  createWorklogPageModal = document.getElementById("createWorklogPageModal"),
  formCreate = document.getElementById("formCreate"),
  empolyeeSelect = document.getElementById("empolyeeSelect"),
  task = document.getElementById("task"),
  editLinks = document.getElementsByClassName("edit"),
  comment = document.getElementById("comment"),
  workDate = document.getElementById("workDate"),
  freeDay = document.getElementById("freeDay"),
  loggedHours = document.getElementById("loggedHours"),
  updateBtn = document.getElementById("updateBtn"),
  showModal = document.getElementById("showModal"),
  wrongLogin = document.getElementById("wrongLogin"),
  counterDisplay = document.getElementById("counterDisplay"),
  userAvatar = document.getElementById("userAvatar");

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
  tableBodyWorklog.innerHTML = null;
});

createWorklogBtn.addEventListener("click", function (event) {
  showModal.classList.remove("display-none");
  createWorklogPageModal.classList.remove("display-none");
  logoutModal.classList.add("display-none");
  createBtn.classList.remove("display-none");
  updateBtn.classList.add("display-none");
  empolyeeSelect.value = null;
  renderSelect(employeeArray, empolyeeSelect);
  employeeArray = [];
  resetFields(formCreate);
  exitModal(showModal);
});

formCreate.addEventListener("submit", function (event) {
  if (
    valid &&
    (!empolyeeSelect.value.length === 0 || !empolyeeSelect.value == 0) &&
    !workDate.value == ""
  ) {
    event.preventDefault();
    showModal.classList.add("display-none");
    createBtn.classList.add("display-none");
    worklogArray = [];
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
        tableBodyWorklog.innerHTML = null;
        createWorklogList(data);
        edit();
        for (let worklogs of data) {
          worklogArray.push(worklogs);
        }
      });
    });
  } else {
    event.preventDefault();
  }
});

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  FetchApi.getMethodGet(
    `http://localhost:3000/employee?emailLogin=${emailLogin.value}&passwordLogin=${passwordLogin.value}`
  ).then(function (data) {
    let validCredentials = data.some(
      (filtered) =>
        filtered.email == emailLogin.value &&
        filtered.password == passwordLogin.value
    );
    let displayName = data.filter((f) => f.email === emailLogin.value);

    displayName.forEach(
      (el) => (userName.textContent = el.first_name + " " + el.last_name)
    );
    displayName.forEach((el) => userAvatar.setAttribute("src", el.image));

    if (validCredentials && valid) {
      homePage.classList.remove("display-none");
      loginPage.classList.add("display-none");
      createList(data);
      openEmployeePage();
    } else if (!validCredentials) {
      showModal.classList.remove("display-none");
      wrongLogin.classList.remove("display-none");
      let counter = 4;
      counterDisplay.innerText = null;
      setInterval(() => {
        if (counter >= 0) {
          counter--;
          counterDisplay.innerText = "Will close in " + counter + "s";
        }
      }, 1000);
      setTimeout(function () {
        wrongLogin.classList.add("display-none");
        showModal.classList.add("display-none");
      }, 4000);

      event.preventDefault();
    } else {
      event.preventDefault();
    }
  });
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
  worklogArray.push(response);
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
          employee.free_day ? "checked" : ""
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
  exitModal(showModal);
  for (let editLink of editLinks) {
    editLink.addEventListener("click", function (event) {
      showModal.classList.remove("display-none");
      createWorklogPageModal.classList.remove("display-none");
      updateBtn.classList.remove("display-none");
      const id = event.target.getAttribute("data-employeeId");
      renderSelect(employeeArray, empolyeeSelect);
      FetchApi.getMethodGet(URl_LOCAL + "/worklog/", id).then(function (
        worklog
      ) {
        empolyeeSelect.value = worklog.employee;
        workDate.value = worklog.work_date;
        freeDay.checked = worklog.free_day;
        loggedHours.value = worklog.logged_hours;
        task.value = worklog.task;
        comment.value = worklog.comment;
        createBtn.classList.add("display-none");
        updateBtn.setAttribute("data-employeeId", worklog.id);
        employeeArray = [];
      });
    });
  }
}

updateBtn.addEventListener("click", function (event) {
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
    showModal.classList.add("display-none");
    exitModal(showModal);
    tableBodyWorklog.innerHTML = null;
    worklogArray = [];
    FetchApi.getMethodGet(URl_LOCAL + "/worklog/").then(function (data) {
      for (let worklogs of data) {
        worklogArray.push(worklogs);
      }
      createWorklogList(data);
      resetFields(formCreate);
      edit();
    });
  });
});

function openEmployeePage() {
  for (let employeeId of employee) {
    employeeId.addEventListener("click", function (event) {
      const id = event.target.getAttribute("data-employeeId");
      showModal.classList.remove("display-none");
      singePageModalContetnt.classList.remove("display-none");
      createWorklogPageModal.classList.add("display-none");

      FetchApi.getMethodGet(URl_LOCAL + "/employee/", id).then(function (data) {
        let filterArr = worklogArray.filter(
          (f) => f.employee === data.first_name + " " + data.last_name
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
        exitModal(showModal, singePageModalContetnt);
      });
    });
  }
}

logoutBtn.addEventListener("click", function () {
  showModal.classList.remove("display-none");
  logoutModal.classList.remove("display-none");
  createWorklogPageModal.classList.add("display-none");
  noBtn.addEventListener("click", function () {
    logoutModal.classList.add("display-none");
    showModal.classList.add("display-none");
  });

  yesBtn.addEventListener("click", function () {
    homePage.classList.add("display-none");
    loginPage.classList.remove("display-none");
    logoutModal.classList.add("display-none");
    showModal.classList.add("display-none");
    valid = false;
    tableBody.innerText = null;
    resetFields(formLogin);
  });
});

let valid = false;

emailLogin.addEventListener("keyup", function () {
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isEmailValid = regexEmail.test(emailLogin.value);
  if (!isEmailValid) {
    ifNotValid(emailLogin);
    displayWarning(emailLogin, "Invalid email address!");
  } else {
    ifValid(emailLogin);
    displayWarning(emailLogin, null);
  }
});
passwordLogin.addEventListener("keyup", function () {
  if (passwordLogin.value.length < 5) {
    ifNotValid(passwordLogin);
    displayWarning(passwordLogin, "Password is to short! Min 5 characters.");
  } else {
    ifValid(passwordLogin);
    displayWarning(passwordLogin, null);
  }
});

empolyeeSelect.addEventListener("click", function () {
  if (empolyeeSelect.value.length === 0 || empolyeeSelect.value == 0) {
    ifNotValid(empolyeeSelect);
    displayWarning(empolyeeSelect, "This fild is required!");
  } else {
    ifValid(empolyeeSelect);
    displayWarning(empolyeeSelect, null);
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
    ifNotValid(loggedHours);
    displayWarning(loggedHours, "Must be a number and min value can be 0!");
  } else {
    ifValid(loggedHours);
    loggedHours.value == 0
      ? (freeDay.checked = true)
      : (freeDay.checked = false);
    displayWarning(loggedHours, null);
  }
});

task.addEventListener("keyup", function () {
  const regexTask = /^[A-Z]/;
  const isTaskValid = regexTask.test(task.value);
  if (!isTaskValid) {
    ifNotValid(task);
    displayWarning(task, "Must start with capital letter!");
  } else {
    ifValid(task);
    displayWarning(task, null);
  }
});
comment.addEventListener("keyup", function () {
  const regexComment = /^.{0,250}$/;
  const isComentValid = regexComment.test(comment.value);
  if (!isComentValid) {
    ifNotValid(comment);
    displayWarning(comment, "Max amount of 250 characters!");
  } else {
    ifValid(comment);
    displayWarning(comment, null);
  }
});

function ifValid(id) {
  valid = true;
  id.classList.remove("invalid");
}
function ifNotValid(id) {
  valid = false;
  id.classList.add("invalid");
}
