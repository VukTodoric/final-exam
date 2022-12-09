export class FetchApi {
  static getMethodPost(url, response) {
    return fetch(url + "/employee/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });
  }

  static getMethodGet(url, param = "") {
    return fetch(url + param, {
      method: "GET",
    }).then(function (data) {
      return data.json();
    });
  }

  static getMethodDelete(url, param = "") {
    return fetch(url + "/employee/" + param, {
      method: "DELETE",
    });
  }

  static getMethodPut(url, response, param = "") {
    return fetch(url + "/employee/" + param, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });
  }
}
