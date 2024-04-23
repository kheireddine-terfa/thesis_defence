const addSessionBtn = document.getElementById('add-session-btn')
const addSessionForm = document.querySelector('.add-session-form')
if (addSessionBtn) {
  addSessionBtn.addEventListener('click', function (e) {
    e.preventDefault()
    const formData = new FormData(addSessionForm) // Get form data
    // Convert form data to JSON object
    const jsonData = {}
    formData.forEach(function (value, key) {
      jsonData[key] = value
    })
    fetch(`/admin/session`, {
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
        popUpContent.textContent = `session added successfully`
        if (addPopUp) {
          addPopUp.style.display = 'flex'
        }
        setTimeout(() => {
          addPopUp.style.display = 'none'
          addSessionForm.reset()
        }, 3000)
      })
      .catch((error) => {
        // Handle errors
        console.error('Error adding  announce:', error)
      })
  })
}
