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

// Utils
const getTodoTasksListElement = () => {
  return document.getElementById("todo");
};

const getCompletedTasksListElement = () => {
  return document.getElementById("completed");
};

const createTaskItem = (children, completed) => {
  const newDiv = document.createElement("div");
  newDiv.classList.add("task-item");
  newDiv.classList.add("draggable");
  newDiv.setAttribute("draggable", "true");
  if (completed === true) {
    newDiv.classList.add("completed");
  }
  newDiv.innerHTML = children;
  return newDiv;
};

const groupTasksByStatus = (tasks) => {
  return tasks.reduce(
    (obj, item) => {
      if (item.completed) {
        obj.completed.push(item);
      } else {
        obj.todo.push(item);
      }
      return obj;
    },
    {
      completed: [],
      todo: [],
    }
  );
};

const addTasksToTodoList = (tasks) => {
  const todoListElm = getTodoTasksListElement();
  if (todoListElm && tasks.length > 0) {
    tasks.map((item) => {
      todoListElm.appendChild(createTaskItem(item.todo, item.completed));
    });
  }
};

const addTasksToCompletedList = (tasks) => {
  const todoListElm = getCompletedTasksListElement();
  if (todoListElm && tasks.length > 0) {
    tasks.map((item) => {
      todoListElm.appendChild(createTaskItem(item.todo, item.completed));
    });
  }
};

// Initializer
document.addEventListener("DOMContentLoaded", function (e) {
  fetchTodos()
    .then((res) => {
      // set data
      setData(res);
      // group the tasks
      const groupedTodos = groupTasksByStatus(data.todos);
      // add tasks to the lists based on the completion status
      addTasksToTodoList(groupedTodos.todo);
      addTasksToCompletedList(groupedTodos.completed);
    })
    .catch((error) => {
      // TODO: Handle the error
    });
});
