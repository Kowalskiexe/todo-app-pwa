const DBManager = (function() {
    return {
    retriveDB: function() {
        console.log("retriving")
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("tasks")
            request.onupgradeneeded = e => {
                let db = e.target.result
                tasks = db.createObjectStore("tasks", {keyPath: "name"})
            }
            request.onsuccess = e => {
                console.log(`retr succ ${e.target.result}`)
                let db = e.target.result
                resolve(db)
            }
            request.onerror = () => {
                alert("erroer")
                reject()
            }
        })
    }
}
})()