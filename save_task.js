window.addEventListener("load", retriveDB)

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