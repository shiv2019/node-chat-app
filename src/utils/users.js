const users = []

// add user 
const addUser = ({ id, username, room }) => {
	// Clean the data 
	username = username.trim().toLowerCase()
	room = room.trim().toLowerCase()

	// Validate the Data
	if (!username || !room ) {
		return {
			error: 'Username and room are required!'
		}
	}
	// check for existing user
	const existingUser = users.find( (user) => {
		return user.room === room && user.username === username	
	})

	// Validate USername
	if(existingUser) {
		return { 
			error: 'Username is already taken!'
		} 
	}

	// store user 
	const user = { id, username , room }
	users.push(user)
	return {user}

}

// Remove User

 const removeUser = (id) => {
 	const index = users.findIndex( (user) => {
 		return user.id === id
 	}) 
 	if (index !== -1) {
 		return users.splice(index, 1)[0]
 	}
 }

 // get user
const getUser = (id) => {
	return users.find((user) => user.id === id)
}

// Get Users in Room
const getUsersInRoom = (room) => {
	room = room.trim().toLowerCase()
	return users.filter((user) => user.room === room)
}

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
}

 
