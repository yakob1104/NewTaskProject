import Task from "./task.js"

const STORAGE_KEY = "task_manager_session_tasks"

class Manager {
    constructor() {
        this.tasks = this.loadTasks()
        this.updateTable()
    }

    loadTasks() {
        const saved = sessionStorage.getItem(STORAGE_KEY)
        if (!saved) return []

        try {
            const parsed = JSON.parse(saved)
            return parsed.map((item) => {
                const task = new Task(item.description)
                task.id = item.id
                task.active = item.active
                return task
            })
        } catch {
            return []
        }
    }

    saveTasks() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
    }

    addTask(task) {
        this.tasks.push(task)
        this.saveTasks()
        this.updateTable()
    }

    removeTask(id) {
        this.tasks = this.tasks.filter((item) => item.id != id)
        this.saveTasks()
        this.updateTable()
    }

    completeTask(id) {
        for (let task of this.tasks) {
            if (task.id == id) {
                task.completeTask()
            }
        }
        this.saveTasks()
        this.updateTable()
    }

    updateTable() {
        let table = document.getElementById("table")
        table.innerHTML = `<tr>
            <th>description</th>
            <th>Complete/Incomplete</th>
            <th>Complete</th>
            <th>Delete</th>
        </tr>`
        for (let task of this.tasks) {
            table.innerHTML += `
            <tr>
                <td>${task.description}</td>
                <td>${task.active ? "Incomplete" : "Complete"}</td>
                <td><button class="btn btn-success" onclick="window.completeTask(${task.id})"><i class="fa-solid fa-check"></i></button></td>
                <td><button class="btn btn-danger" onclick="window.removeTask(${task.id})"><i class="fa-solid fa-delete-left"></i></button></td>
            </tr>
            `
        }
    }
}

let manager = new Manager()

window.completeTask = (id) => {
    manager.completeTask(id)
}

window.removeTask = (id) => {
    if (confirm("Are you sure?")) {
        manager.removeTask(id)
        alert("Task has been removed!")
    }
}

window.addTask = () => {
    let taskName = document.getElementById("tasku").value
    document.getElementById("tasku").value = ""
    if (!taskName) return
    let newTask = new Task(taskName)
    manager.addTask(newTask)
}