const addProfessorBtn = document.getElementById('add-professor-btn')
const addProfessorForm = document.querySelector('.add-professor-form')
if (addProfessorBtn) {
  addProfessorBtn.addEventListener('click', function (e) {
    e.preventDefault()
        // Check if any required fields are empty
        const inputs = addProfessorForm.querySelectorAll('input[required]')
        let isValid = true
    
        inputs.forEach(function (input) {
          if (input.value.trim() === '') {
            isValid = false
            input.classList.add('is-invalid')
          } else {
            input.classList.remove('is-invalid')
          }
        })
    
        // If any required field is empty, do not proceed with API call
        if (!isValid) {
          return
        }
    const formData = new FormData(addProfessorForm) // Get form data

    // Convert form data to JSON object
    const jsonData = {}
    formData.forEach(function (value, key) {
      if (key === 'fields') {
        // If key is 'fields', we want to ensure it's sent as an array
        // Retrieve existing array or initialize it if it doesn't exist
        if (!jsonData[key]) {
          jsonData[key] = []
        }
        // Add the new value to the array
        jsonData[key].push(value)
      } else {
        jsonData[key] = value
      }
    })

    fetch(`/admin/professor`, {
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
        popUpContent.textContent = 'Professor added successfully.'
        if (addPopUp) {
          addPopUp.style.display = 'flex'
        }
        setTimeout(() => {
          addPopUp.style.display = 'none'
          addProfessorForm.reset()
        }, 3000)
      })
      .catch((error) => {
        // Handle errors
        console.error('Error adding professor:', error)
      })
  })
}
