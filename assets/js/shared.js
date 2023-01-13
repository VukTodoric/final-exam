export function resetFields(list) {
  for (let item of list) {
    item.value = null;
  }
}

export function exitModal(page, content = "", array = "") {
  let exitBtn = document.getElementsByClassName("exitBtn");

  for (let exit of exitBtn) {
    exit.addEventListener("click", function () {
      array = [];
      page.classList.add("display-none");
      if (content) {
        content.innerHTML = null;
      }
    });
  }
}

export function renderSelect(array, id) {
  for (let content of array) {
    let option = document.createElement("option");
    option.setAttribute("value", content.first_name + " " + content.last_name);
    let text = document.createTextNode(
      content.first_name + " " + content.last_name
    );
    id.appendChild(option).appendChild(text);
  }
}

const warningBox = document.createElement("div");
warningBox.classList = "warning";

export function displayWarning(id, message) {
  id.parentNode.appendChild(warningBox);
  if (id.classList.contains("invalid")) {
    warningBox.innerHTML = message;
  } else {
    warningBox.innerHTML = null;
  }
}
