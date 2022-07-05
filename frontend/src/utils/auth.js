export const BASE_URL = "https://api.around-the-us.students.nomoreparties.sbs";

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res) {
        return res.json();
      }
    })
    .then((data) => {
      if (!data.message) {
        return data;
      } else {
        return;
      }
    });
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res) {
        return res.json();
      }
    })
    .then((data) => {
      if (!data.message) {
        localStorage.setItem("token", data.token);
        return data;
      } else {
        return;
      }
    });
};

// sending a request to the authorization route
export const checkToken = (token) =>
  fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      Acccept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.ok
        ? res.json()
        : Promise.reject(`${res.status} - ${res.message}`);
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
