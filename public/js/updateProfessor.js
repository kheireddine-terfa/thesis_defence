document.addEventListener('DOMContentLoaded', function () {
  const updateProfessorForms = document.querySelectorAll(
    '.update-professor-form',
  )
  if (updateProfessorForms.length > 0) {
    updateProfessorForms.forEach(function (updateProfessorForm) {
      updateProfessorForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateProfessorForm) // Get form data

        const professorId = updateProfessorForm
          .querySelector('.update-professor-btn')
          .getAttribute('data-professor-id')
        console.log('professor ID:', professorId)

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
        console.log(JSON.stringify(jsonData))
        // Make API request to update the professor
        fetch(`/admin/professor/${professorId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData), // Convert data to JSON string
        })
          .then((response) => {
            if (!response.ok) {
              response.json().then((data) => {
                console.log('Error:', data.message)
                // Display error message to the user
                const errorMessageElement = document.getElementById(
                  'popup-error-content',
                )
                errorMessageElement.textContent = data.message
                const errPopup = document.getElementById('popup-error')
                errPopup.classList.add('show') // Show error message
                setTimeout(() => {
                  errPopup.classList.remove('show')
                }, 3000)
              })
            }
            return response.json()
          })
          .then((data) => {
            window.location.href = '/admin/professors'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating professor:', error)
          })
      })
    })
  }
})
