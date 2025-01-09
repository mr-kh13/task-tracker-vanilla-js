// Constants
const BASE_API_URL = "https://dummyjson.com";
const API_URLS = {
  todosList: `${BASE_API_URL}/todos`,
};

// Global Variables
let data = {
  limit: 0,
  skip: 0,
  total: 0,
  todos: [],
};

const setData = (value) => {
  data = value;
};

// Data
const fetchTodos = async () => {
  const res = await fetch(API_URLS.todosList);
  return res.json();
};

// Initializer
document.addEventListener("DOMContentLoaded", function (e) {
  fetchTodos()
    .then((res) => {
      // set data
      setData(res);
    })
    .catch((error) => {
      // TODO: Handle the error
    });
});
