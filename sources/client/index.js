const usersEventSource = new EventSource("/api/users")

usersEventSource.addEventListener("open", () => {
    console.log("Event source connected with the server")
})

usersEventSource.addEventListener("error", error => {
    console.error("Error with the server")
    console.error(error)
})

usersEventSource.addEventListener("update", event => {
    try {
        const usersElement = document.getElementById("users")
        const users = JSON.parse(event.data)

        if (!usersElement) {
            throw new Error("Users list not found")
        }

        usersElement.innerHTML = ""

        users.forEach(user => {
            const userElement = document.createElement("li")
            userElement.innerText = `[#${user.identifier}] ${user.email}`
            usersElement.appendChild(userElement)
        })
    } catch (error) {
        console.error(error)
    }
})