export class FetchApi {
  static getMethodPost(url, response) {
    return fetch(url, {
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

  static getMethodPut(url, response, param = "") {
    return fetch(url + param, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });
  }
}
