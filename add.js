window.addEventListener("load", retriveDB)

let db

function retriveDB() {
    const request = indexedDB.open("tasks")
    request.onupgradeneeded = e => {
        db = e.target.result
        tasks = db.createObjectStore("tasks", {keyPath: "name"})
    }
    request.onsuccess = e => {
        db = e.target.result
    }
    request.onerror = () => {
        alert("erroer")
    }
}

function saveTask() {
    console.log("saving task")
    let taskName = document.getElementById("taskName").value
    if (taskName == null || taskName == "")
        return;
    console.log(`saving ${taskName}`)
    let resetOnMonday = document.getElementById("resetMonday").checked
    let resetOnTuesday = document.getElementById("resetTuesday").checked
    let resetOnWednesday = document.getElementById("resetWednesday").checked
    let resetOnThursday = document.getElementById("resetThursday").checked
    let resetOnFriday = document.getElementById("resetFriday").checked
    let resetOnSaturday = document.getElementById("resetSaturday").checked
    let resetOnSunday = document.getElementById("resetSunday").checked

    const newTask = {
        name: taskName,
        resetOnMonday: resetOnMonday,
        resetOnTuesday: resetOnTuesday,
        resetOnWednesday: resetOnWednesday,
        resetOnThursday: resetOnThursday,
        resetOnFriday: resetOnFriday,
        resetOnSaturday: resetOnSaturday,
        resetOnSunday: resetOnSunday,
        dateOfCompletion: new Date(0).getTime()
    }

    const tx = db.transaction("tasks", "readwrite")
    tx.onerror = () => {
        // w8 to nie miało edytować
        // TODO: fix 
        const delTx = db.transaction("tasks", "readwrite")
        const tasks = delTx.objectStore("tasks")
        tasks.delete(taskName)
        console.log("deleted old")
        saveTask() // well that makes it recursive
    }
    const tasks = tx.objectStore("tasks")
    tasks.add(newTask)
}