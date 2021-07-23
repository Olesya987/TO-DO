let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let button = null;
let input = null;
let input2 = null;
let text = null;
let div = null;
let imgEdit = null;
let imgDel = null;
let checkbox = null;
let container = null;
let content = null;
let indexTask = null;
let indexTask2 = null;
let count = 0;
let task = "";
///

window.onload = async () => {
  input = document.getElementById("input-task");
  button = document.getElementById("button-task");
  const response = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });
  const result = await response.json();
  tasks = result.data;
  input.addEventListener("change", writeTask);
  button.addEventListener("click", addTask);
  render();
};
const writeTask = async (event) => {
  task = event.target.value;
};

const addTask = async (event) => {
  if (task.length != 0) {
    const resp = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: task,
        isCheck: false,
      }),
    });
    const result = await resp.json();
    tasks = result.data;
    task = "";
    input.value = "";
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
};

const render = async () => {
  content = document.getElementById("add-tasks");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  tasks = _.sortBy(tasks, "isCheck");
  tasks.map((item, index) => {
    container = document.createElement("div");
    container.id = `task ${index}`;
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = function () {
      funcCheck(index);
    };
    container.appendChild(checkbox);
    text = document.createElement("p");
    text.innerText = item.text;
    text.className = item.isCheck ? "done-text" : "";
    input2 = document.createElement("input");
    input2.type = "text";
    input2.value = item.text;
    if (index === indexTask && (indexTask != indexTask2 || count === 2)) {
      container.appendChild(input2);
      count = 0;
      indexTask2 = indexTask;
      input2.addEventListener("change", (e) => changeTask(e, index));
      indexTask = null;
    } else container.appendChild(text);
    container.className = "task";
    div = document.createElement("div");
    imgDel = document.createElement("img");
    imgDel.src = "icons8-удалить-64.png";
    imgEdit = document.createElement("img");
    imgEdit.src = "icons8-редактировать-64.png";
    imgDel.onclick = function () {
      funcDel(index);
    };
    div.append(imgEdit, imgDel);
    if (checkbox.checked) {
      div.removeChild(imgEdit);
    }
    container.appendChild(div);
    content.appendChild(container);
    imgEdit.addEventListener("click", (e) => funcEdit(e, index));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
};

const funcEdit = async (event, index) => {
  indexTask = index;
  count++;
  render();
};

const changeTask = async (event, index) => {
  const { id } = tasks[index];
  if (event.target.value.length != 0) {
    const resp = await fetch("http://localhost:8000/updateTask", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id,
        text: event.target.value,
      }),
    });
    const result = await resp.json();
    tasks = result.data;
    indexTask2 = null;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
  }
};

const funcDel = async (index) => {
  const resp = await fetch(
    `http://localhost:8000/deleteTask?id=${tasks[index].id}`,
    {
      method: "DELETE",
    }
  );
  const result = await resp.json();
  tasks = result.data;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
};

const funcCheck = async (index) => {
  const { id, isCheck } = tasks[index];
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      id,
      isCheck: !isCheck,
    }),
  });
  const result = await resp.json();
  tasks = result.data;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
};
