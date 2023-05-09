//crud.js
import tasks from './list.js';
import storage from './saveTasksToLocalStorage.js';
import dragDrop from './dragDrop.js';

export default function addTask(taskItem, index, complete) {
  if (!taskItem) return;

  const refreshBtn = document.querySelector('.reset-i');
  const listWrapper = document.querySelector('.to-do-list');
  const taskWrapper = document.createElement('div');
  taskWrapper.classList.add('list-item');
  taskWrapper.setAttribute('id', index);
  taskWrapper.setAttribute('draggable', true);

  const task = document.createElement('div');
  task.classList.add('task');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (complete) {
    checkbox.checked = true;
    taskWrapper.classList.toggle('completed');
  }
  const btnWrapper = document.createElement('div');
  const dragBtn = document.createElement('i');
  dragBtn.classList.add('cross');
  const delBtn = document.createElement('i');
  delBtn.classList.add('del-btn');
  const description = document.createElement('input');
  description.type = 'text';
  description.classList.add('task-description');
  description.value = taskItem;
  description.addEventListener('focus', () => {
    taskWrapper.classList.toggle('field-focus');
    delBtn.style.display = 'block';
    dragBtn.style.display = 'none';
  });
  description.addEventListener('blur', () => {
    taskWrapper.classList.toggle('field-focus');
  });
  description.addEventListener('input', () => {
    const index = +taskWrapper.getAttribute('id') - 1;
    tasks.taskList[index].updateTask(description.value);
    storage();
  });

  delBtn.addEventListener('click', () => {
    const theTask = delBtn.parentElement.parentElement;
    tasks.deleteTask(+theTask.getAttribute('id'));
    theTask.remove();
    const listItems = document.querySelectorAll('.list-item');
    for (let i = 0; i < listItems.length; i += 1) {
      listItems[i].setAttribute('id', i + 1);
    }
    storage();
  });
  refreshBtn.addEventListener('click', () => {
    delBtn.style.display = 'none';
    dragBtn.style.display = 'block';
  });
  dragBtn.addEventListener('click', () => {
    dragDrop();
  });
  const toggleCompleted = (e) => {
    const checkParent = e.target.parentElement.parentElement;
    const index = +checkParent.getAttribute('id') - 1;
    tasks.taskList[index].toggleCompleted();
    checkParent.classList.toggle('completed');
    storage();
  };

  checkbox.addEventListener('change', toggleCompleted);
  btnWrapper.appendChild(delBtn);
  task.appendChild(checkbox);
  task.appendChild(description);
  task.appendChild(dragBtn);
  taskWrapper.appendChild(task);
  taskWrapper.appendChild(btnWrapper);
  listWrapper.appendChild(taskWrapper);
}
//main.js
import Tasks from './list.js';
import add from './crud.js';
import storage from './saveTasksToLocalStorage.js';

const addInput = document.querySelector('.add-item input');
const returnBtn = document.querySelector('.return-i');
const createTaskInput = document.querySelector('#create-task');
const clearAll = document.getElementById('clearCompleted');

if (localStorage.tasks) {
  const storedTasks = JSON.parse(localStorage.tasks);
  storedTasks.forEach((item) => {
    Tasks.taskList.push(new Tasks(item.task, item.index, item.isCompleted));
    add(item.task, item.index, item.isCompleted);
  });
}

const updateTaskArray = (task) => {
  Tasks.taskList.push(new Tasks(task, Tasks.taskList.length + 1, false));
};

returnBtn.addEventListener('click', () => {
  add(addInput.value, Tasks.taskList.length + 1, false);
  updateTaskArray(addInput.value);
  storage();
  addInput.value = '';
});

createTaskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    add(addInput.value, Tasks.taskList.length + 1, false);
    updateTaskArray(addInput.value);
    storage();
    addInput.value = '';
  }
});
clearAll.addEventListener('click', (e) => {
  e.preventDefault();
  const allTasks = document.querySelectorAll('.list-item');
  allTasks.forEach((item) => {
    if (item.classList.value.includes('completed')) {
      item.remove();
      Tasks.deleteCompleted();
    }
  });
  storage();
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach((listItem, index) => {
    listItem.setAttribute('id', index + 1);
  });
});
//list.js
class List {
    constructor(task, index, complete) {
      this.task = task;
      this.index = index;
      this.isCompleted = complete;
    }
  
    static taskList = [];
  
    toggleCompleted() {
      this.isCompleted = !this.isCompleted;
    }
  
    updateTask(text) {
      this.task = text;
    }
  
    static reindex() {
      List.taskList.forEach((task, i) => {
        task.index = i + 1;
      });
    }
  
    static deleteTask(i) {
      List.taskList = List.taskList.filter((each) => each.index !== i);
      List.reindex();
    }
  
    static deleteCompleted() {
      List.taskList = List.taskList.filter((each) => !each.isCompleted);
      List.reindex();
    }
  }
  
  export default List;
//saveTasksToLocalStorage
import List from './list.js';

const saveTasksToLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(List.taskList));
};

export default saveTasksToLocalStorage;
