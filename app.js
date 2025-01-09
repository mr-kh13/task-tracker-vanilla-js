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

const createTaskItem = (item) => {
  const newDiv = document.createElement("div");
  newDiv.classList.add("task-item");
  newDiv.classList.add("draggable");
  newDiv.setAttribute("draggable", "true");
  newDiv.setAttribute("data-id", item.id);
  if (item.completed === true) {
    newDiv.classList.add("completed");
  }
  newDiv.innerHTML = item.todo;
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
      todoListElm.appendChild(createTaskItem(item));
    });
  }
};

const addTasksToCompletedList = (tasks) => {
  const todoListElm = getCompletedTasksListElement();
  if (todoListElm && tasks.length > 0) {
    tasks.map((item) => {
      todoListElm.appendChild(createTaskItem(item));
    });
  }
};

const addDraggablesEventListeners = () => {
  const draggables = document.querySelectorAll(".draggable");
  for (const draggable of draggables) {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  }
};

const handleDrop = (dropArea) => {
  const draggedElement = document.querySelector(".dragging");
  if (draggedElement) {
    const tasksListId = dropArea.getAttribute("id");
    if (tasksListId === "completed") {
      const taskId = draggedElement.getAttribute("data-id");
      data.todos = data.todos.map((item) => {
        if (item.id === Number(taskId)) {
          const taskElement = document.querySelector(`[data-id="${taskId}"]`);
          taskElement.classList.add("completed");
          return { ...item, completed: true, status: tasksListId };
        }
        return item;
      });
    } else {
      const taskId = draggedElement.getAttribute("data-id");
      data.todos = data.todos.map((item) => {
        if (item.id === Number(taskId)) {
          const taskElement = document.querySelector(`[data-id="${taskId}"]`);
          taskElement.classList.remove("completed");
          return { ...item, completed: false, status: tasksListId };
        }
        return item;
      });
    }
    dropArea.appendChild(draggedElement);
  }
};

const addDropAreasEventListeners = () => {
  const dropAreas = document.querySelectorAll(".tasks-list");
  for (const dropArea of dropAreas) {
    dropArea.addEventListener("dragover", (event) => {
      // prevent default to allow drop
      event.preventDefault();
    });
    dropArea.addEventListener("drop", (event) => {
      // prevent default action (open as a link for some elements)
      event.preventDefault();
      handleDrop(dropArea);
    });
  }
};

// Initializer
document.addEventListener("DOMContentLoaded", function (e) {
  fetchTodos()
    .then((res) => {
      // initial data status
      res.todos.forEach((item) => {
        item.status = item.completed ? "completed" : "todo";
      });
      // set data
      setData(res);
      // group the tasks
      const groupedTodos = groupTasksByStatus(data.todos);
      // add tasks to the lists based on the completion status
      addTasksToTodoList(groupedTodos.todo);
      addTasksToCompletedList(groupedTodos.completed);
      // add drag & drop event listeners
      addDraggablesEventListeners();
      addDropAreasEventListeners();
    })
    .catch((error) => {
      // TODO: Handle the error
    });
});
