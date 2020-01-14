 	const socket = io()
 		// Elements 
 		const $messageForm = document.querySelector('#messageForm')
 		const $messageFormInput = $messageForm.querySelector('input')
 		const $messageFormButton = $messageForm.querySelector('button') 
		const $sendLocationButton = document.querySelector('#sendLocation')
		const $messages = document.querySelector('#messages')

		// Templates
		const messageTemplate = document.querySelector('#messageTemplate').innerHTML
		const locationMessageTemplate = document.querySelector('#locationMessageTemplate').innerHTML
		const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
		// options
		// e.g. location.search = "?username=shiv&room=bangalore"
		const {username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true}) // ignore will remove ?

			const autoScroll = () =>{
				// New message Element 
				const $newMessage = $messages.lastElementChild

				// height of new message
				const newMessageStyles = getComputedStyle($newMessage)
				const newMessageMargin = parseInt(newMessageStyles.marginBottom)
				const newMessageHeight = $newMessage.offSetHeight + newMessageMargin

				// visible height 
				const visibleHeight = $messages.offSetHeight

				// height of messages container
				const containerHeight = $messages.scrollHeight

				// how far i have scrolled
				const scrollOffset = $messages.scrollTop + visibleHeight

				if (containerHeight - newMessageHeight <= scrollOffset) {
					$messages.scrollTop = $messages.scrollHeight
				}
			}

 			socket.on('message', (messageData) => {
	  		console.log(messageData);
	  		const html = Mustache.render(messageTemplate, {
	  			username: messageData.username,
	  			message: messageData.text,
	  			createdAt: moment(messageData.createdAt).format('h:mm a ')
	  		})
	  		$messages.insertAdjacentHTML('beforeend', html)
	  		autoScroll()
	  	});

 			socket.on('locationMessage', (message) => {
 				console.log(message);
 				const html = Mustache.render(locationMessageTemplate, {
 					username: message.username,
 					url: message.url,
 					createdAt: moment(message.createdAt).format('h:mm a')
 				})
 				$messages.insertAdjacentHTML('beforeend', html)
 				autoScroll()
				})

 			socket.on('roomData', ({ room, users }) => {
 				const html = Mustache.render(sidebarTemplate, {
 					room,
 					users
 				})
 				document.querySelector('#sidebar').innerHTML = html
 			})
	
	  	$messageForm.addEventListener('submit', (e) => {
	  		e.preventDefault()
	  		// disable
	  		$messageFormButton.setAttribute('disabled' , 'disabled')

	  		// disable
	  		const message = e.target.elements.message.value

	  		// server is emitting the event
	  		socket.emit('sendMessage', message, (error) => {

	  			// enable
	  			$messageFormButton.removeAttribute('disabled')
	  			$messageFormInput.value = ''
	  			$messageFormInput.focus()
	  			
	  			if(error) {
	  				return console.log(error)
	  			} 

	  			console.log('Message Delivered!')
	  		})
	  	})

	  	 $sendLocationButton.addEventListener('click', (e) => {
	  	 	if (!navigator.geolocation) {
	  	 		return alert('GeoLocation is not Suppoerted by your Browser')
	  	 	}
	  	 	 // disable button 
	  	 	$sendLocationButton.setAttribute('disabled', 'disabled')
	  	 	navigator.geolocation.getCurrentPosition((position) => {

	  	 		socket.emit('sendLocation', {
	  	 			latitude: position.coords.latitude ,
	  	 			longitude: position.coords.longitude
	  	 		}, ()=> {
	  	 			console.log('Location Shared Successfully :)')
	  	 			// Enable button 
	  	 			$sendLocationButton.removeAttribute('disabled')
	  	 		})
	  	 	})
	  	 })

	  	 socket.emit('join', { username, room }, (error) => {
	  	 	if (error) {
	  	 		alert(error)
	  	 		location.href = '/'
	  	 	}
	  	 })


	  
