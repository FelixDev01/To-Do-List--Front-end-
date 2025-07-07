const API_BASE = 'http://localhost:8080';

const button = document.getElementById("loadTaskBtn");
const taskList = document.getElementById("taskList");

button.addEventListener('click', () => {
    fetch(`${API_BASE}/tasks`)
    .then(response => response.json())
    .then(data => {
        taskList.innerHTML ='';
        data.content.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.title} (Status: ${task.status}) - User ID: ${task.userId}`;
            taskList.appendChild(li);
        })
    })
    .catch(error => {
        alert("Error loading tasks " + error);
    })
});