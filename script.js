let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
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
let count=0;
let task = '';

window.onload = () => {
  input = document.getElementById('input-task');
  button = document.getElementById('button-task');
  input.addEventListener('change', writeTask);
  button.addEventListener('click', addTask);
  render();

  

}
const writeTask = (event) => {
  task = event.target.value;
}

const addTask = (event) => {
  if (task.length != 0) {
    tasks.push({
      text: task,
      isDone: false
    });
    task = '';
    input.value = '';
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

const render = () => {
  content = document.getElementById('add-tasks');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  sortTasks();
  tasks.map((item, index) => {
    container = document.createElement('div');
    container.id = `task ${index}`;
    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isDone;
    checkbox.onchange = function () {
      funcCheck(index);
    };
    container.appendChild(checkbox);
    text = document.createElement('p');
    text.innerText = item.text;
    text.className = item.isDone ? 'done-text' : '';
    input2 = document.createElement('input');
    input2.type = 'text';
    input2.value = item.text;
    if (index === indexTask && (indexTask != indexTask2||count==2)) {
      container.appendChild(input2);
      count=0;
      indexTask2 = indexTask;
      input2.addEventListener('change', (e) => changeTask(e, index));

      indexTask = null;
    } else container.appendChild(text);
    container.className = 'task';
    div = document.createElement('div');

    imgDel = document.createElement('img');
    imgDel.src = 'icons8-удалить-64.png';
    imgEdit = document.createElement('img');
    imgEdit.src = 'icons8-редактировать-64.png';

    imgDel.onclick = function () {
      funcDel(index);
    }
    div.append(imgEdit, imgDel);
    if (checkbox.checked) {
      div.removeChild(imgEdit);
    }
    container.appendChild(div);

    content.appendChild(container);
    imgEdit.addEventListener('click', (e) => funcEdit(e, index));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  })

}

const funcEdit = (event, index) => {
  indexTask = index;
  count++;
  render();
}

const changeTask = (event, index) => {

  if (event.target.value.length != 0) {
    tasks[index].text = event.target.value;
    indexTask2 = null;
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

const funcDel = (index) => {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

const funcCheck = (index) => {
  tasks[index].isDone = !tasks[index].isDone;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}


const sortTasks = () => {
  for (let i = 0; i < tasks.length; i++) {
    for (let j = 1; j < tasks.length; j++) {
      if (+tasks[j - 1].isDone > +tasks[j].isDone) {
        let c = tasks[j];
        tasks[j] = tasks[j - 1];
        tasks[j - 1] = c;
      }
    }
  }
}