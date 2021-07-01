const TasksLoader = (() => {
    let divTasks
    return {
        getDaysSinceWeekday: (day) => {
            let days = new Date().getDay() - day
            if (days < 0)
                days += 7
            return days
        },
        init: () => {
            divTasks = document.getElementById("divTasks")
            console.log(`divTasks: ${divTasks}`)

            DBManager.retriveDB().then(loadTasks)

            function loadTasks(db) {
                console.log(`loading tasks db: ${db}`)
                const tx = db.transaction(['tasks'], "readonly")
                const tasks = tx.objectStore('tasks')

                tasks.openCursor().onsuccess = e => {
                    const cursor = e.target.result
                    if (!cursor)
                        return

                    const taskName = cursor.value.name
                    const mon = cursor.value.resetOnMonday ? "active" : "inactive"
                    const tue = cursor.value.resetOnTuesday ? "active" : "inactive"
                    const wen = cursor.value.resetOnWednesday ? "active" : "inactive"
                    const thu = cursor.value.resetOnThursday ? "active" : "inactive"
                    const fri = cursor.value.resetOnFriday ? "active" : "inactive"
                    const sat = cursor.value.resetOnSaturday ? "active" : "inactive"
                    const sun = cursor.value.resetOnSunday ? "active" : "inactive"

                    const dateOfCompletion = new Date(cursor.value.dateOfCompletion)
                    let done = dateOfCompletion.getTime != new Date(0).getTime()
                    console.log(`raw DoC: ${cursor.value.dateOfCompletion} DoC: ${dateOfCompletion.getTime()} now: ${new Date().getTime()} zero: ${new Date(0).getTime()}`)
                    const daysSinceCompletion = Math.floor((Date.now() - dateOfCompletion.getTime()) / 1000 / 60 / 60 / 24)

                    console.log(`task: ${taskName} initially done: ${done} DSC: ${daysSinceCompletion}`)
                    if (sun === "active" && daysSinceCompletion > TasksLoader.getDaysSinceWeekday(0))
                        done = false
                    if (mon === "active" && daysSinceCompletion > TasksLoader.getDaysSinceWeekday(1))
                        done = false
                    if (tue === "active" && daysSinceCompletion > TasksLoader.getDaysSinceWeekday(2))
                        done = false
                    if (wen === "active" && daysSinceCompletion > TasksLoader.getDaysSinceWeekday(3))
                        done = false
                    if (thu === "active" && daysSinceCompletion > TasksLoader.getDaysSinceWeekday(4))
                        done = false
                    if (fri === "active" && daysSinceCompletion > TasksLoader.getDaysSinceWeekday(5))
                        done = false
                    if (sat === "active" && daysSinceCompletion > TasksLoader.getDaysSinceWeekday(6))
                        done = false

                    done = done ? "done" : "ongoing"

                    divTasks.innerHTML += `
                        <div class="task ${done}" id="${taskName}" onclick="TasksLoader.changeState('${taskName}')" ondblclick="TasksLoader.removeTask('${taskName}')">
                            <h2>&#9679; ${taskName}</h2>
                            <h2 style="float: right; margin-top: -10px; color: black; text-decoration: none" onclick="TasksLoader.removeTask('${taskName}')">x </h2>
                            <span class="${mon}" style="clear: both">M,</span>
                            <span class="${tue}">T,</span>
                            <span class="${wen}">W,</span>
                            <span class="${thu}">T,</span>
                            <span class="${fri}">F,</span>
                            <span class="${sat}">S,</span>
                            <span class="${sun}">S</span>
                        </div>`

                    cursor.continue()
                }
            }
        },
        changeState: (name) => {
            console.log(`completing/reseting ${name}`)
            let task = document.getElementById(name)
            let isDoneNow = task.classList.contains("ongoing")
            if (isDoneNow) {
                task.classList.remove("ongoing")
                task.classList.add("done")
            } else {
                task.classList.remove("done")
                task.classList.add("ongoing")
            }

            DBManager.retriveDB().then((db) => {
                const tx = db.transaction(['tasks'], "readwrite")
                const tasks = tx.objectStore('tasks')
                const request = tasks.get(`${name}`)
                request.onsuccess = () => {
                    let record = request.result
                    console.log(`updating: ${record.name}`)
                    if (isDoneNow) {
                        record.dateOfCompletion = new Date().getTime()
                    } else {
                        record.dateOfCompletion = new Date(0).getTime()
                    }
                    tasks.put(record)
                }
            })
        },
        removeTask: (name) => {
            console.log(`removing ${name}`)
            let task = document.getElementById(name)
            divTasks.removeChild(task)

            DBManager.retriveDB().then((db) => {
                const tx = db.transaction(['tasks'], "readwrite")
                const tasks = tx.objectStore('tasks')
                tasks.delete(name)
            })
        }
    }
})()
window.addEventListener("load", TasksLoader.init)