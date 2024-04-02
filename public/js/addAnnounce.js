const addBtn = document.getElementById('add-announce-btn')
const addAnnounceForm = document.querySelector('.add-announce-form')

addBtn.addEventListener('click', function (e) {
  e.preventDefault()
  const formData = new FormData(addAnnounceForm) // Get form data
  // Convert form data to JSON object
  const jsonData = {}
  formData.forEach(function (value, key) {
    jsonData[key] = value
  })
  fetch(`/admin/announce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData), // Convert data to JSON string
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      const addPopUp = document.getElementById('popup-add')
      const popUpContent = document.getElementById('popup-content')
      popUpContent.textContent = 'announce added successfully ..'
      if (addPopUp) {
        addPopUp.style.display = 'flex'
      }
      setTimeout(() => {
        addPopUp.style.display = 'none'
        addAnnounceForm.reset()
      }, 3000)
    })
    .catch((error) => {
      // Handle errors
      console.error('Error adding  announce:', error)
    })
})
