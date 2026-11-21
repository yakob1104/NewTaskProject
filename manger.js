import Task from "./task.js"

const STORAGE_KEY = "task_manager_session_tasks"

class Manager {
    constructor() {
        this.tasks = this.loadTasks()
        this.updateTable()
    }

    loadTasks() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY)
            if (!saved) return []

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
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
        } catch {
            // מתעלם אם הדפדפן חוסם גישה ל-sessionStorage
        }
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
        const tbody = document.getElementById("table-body")
        tbody.innerHTML = ""

        for (const task of this.tasks) {
            const row = document.createElement("tr")

            const descCell = document.createElement("td")
            descCell.textContent = task.description

            const statusCell = document.createElement("td")
            statusCell.textContent = task.active ? "Incomplete" : "Complete"

            const completeCell = document.createElement("td")
            const completeBtn = document.createElement("button")
            completeBtn.type = "button"
            completeBtn.className = "btn btn-success"
            completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
            completeBtn.addEventListener("click", () => this.completeTask(task.id))
            completeCell.appendChild(completeBtn)

            const deleteCell = document.createElement("td")
            const deleteBtn = document.createElement("button")
            deleteBtn.type = "button"
            deleteBtn.className = "btn btn-danger"
            deleteBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>'
            deleteBtn.addEventListener("click", () => {
                if (confirm("Are you sure?")) {
                    this.removeTask(task.id)
                    alert("Task has been removed!")
                }
            })
            deleteCell.appendChild(deleteBtn)

            row.append(descCell, statusCell, completeCell, deleteCell)
            tbody.appendChild(row)
        }
    }
}

const manager = new Manager()

function handleAddTask() {
    const input = document.getElementById("tasku")
    const taskName = input.value.trim()
    input.value = ""
    if (!taskName) return

    const newTask = new Task(taskName)
    manager.addTask(newTask)
    input.focus()
}

document.getElementById("add-btn").addEventListener("click", handleAddTask)
document.getElementById("tasku").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleAddTask()
    }
})
