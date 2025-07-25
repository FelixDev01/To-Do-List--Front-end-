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
            li.textContent = `${task.title}- Status: ${task.status} - User ID: ${task.userId}`;
            li.style.marginBlock = '5px';

            const moreInfoBtn = document.createElement('button');
            moreInfoBtn.textContent ='More info';
            moreInfoBtn.style.marginRight = '10px';
            moreInfoBtn.style.marginLeft = '10px';
            
            const editBtn = document.createElement('button');
            editBtn.textContent ='Edit';
            editBtn.addEventListener('click', () => fillFormForEdit(task));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent ='Delete';
            deleteBtn.style.marginLeft = '10px';

            moreInfoBtn.addEventListener('click', () => {
                let description =li.querySelector('.task-description');
                
                if(description){
                    description.remove();
                    moreInfoBtn.textContent ='More info'
                }

                else {
                    description = document.createElement('p');
                    description.textContent = `Description: ${task.description}`;
                    description.classList.add('task-description');
                    description.style.marginTop ='5px';
                    description.style.fontStyle ='italic';
                    
                    
                    li.appendChild(description);
                    moreInfoBtn.textContent = 'Less Info';
                    

                }
                

            })

            deleteBtn.addEventListener('click', async () =>{
                const confirmDelete = confirm('Are you sure you want to delete this task?');
                if(!confirmDelete) return;

                try {
                    const response = await fetch(`${API_BASE}/tasks/${task.id}`, {
                    method: 'DELETE'
                });

                    if (response.ok) {
                    alert("Task deleted!");
                    button.click(); 
                    }
                    else {
                    const error = await response.text();
                    alert("Erro ao deletar: " + error);
                    }
                }
                catch (err) {
                    alert("Erro de conexão: " + err);
                }
        });

            li.appendChild(moreInfoBtn);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    })
    .catch(error => {
        alert("Error loading tasks " + error);
    });
});

const taskForm = document.getElementById("task-form");

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;
    const userId = document.getElementById("userId").value;
    
    const taskData = {
        title: title,
        description: description,
        status: status,
        userId: userId
    };
    try {
        const url = editingTaskId
            ? `${API_BASE}/tasks/${editingTaskId}`
            : `${API_BASE}/tasks`;

        const method = editingTaskId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            alert(editingTaskId ? "Task updated successfully!" : "Task created successfully!");
            taskForm.reset();
            editingTaskId = null;

            const submitBtn = taskForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Save Task";

            button.click();
        } else {
            const error = await response.text();
            alert("Error saving task: " + error);
        }
    } 
    catch (err) {
        alert("Connection error: " + err);
    }
});

let editingTaskId = null;

function fillFormForEdit(task) {
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('status').value = task.status;
    document.getElementById('userId').value = task.userId;

    editingTaskId = task.id;

    const submitBtn = taskForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Update Task";
}

