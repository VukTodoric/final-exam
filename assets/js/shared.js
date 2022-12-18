export function resetFields(list) {
  for (let item of list) {
    item.value = null;
  }
}

export function exitModal(page, content = "") {
  let exitBtn = document.getElementsByClassName("exitBtn");

  for (let exit of exitBtn) {
    exit.addEventListener("click", function () {
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
