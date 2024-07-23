document.addEventListener('DOMContentLoaded', function () {
  const updateThesisDefenceForms = document.querySelectorAll(
    '.update-thesis-defence-form',
  )
  if (updateThesisDefenceForms.length > 0) {
    updateThesisDefenceForms.forEach(function (updateThesisDefenceForm) {
      updateThesisDefenceForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateThesisDefenceForm) // Get form data
        const thesisDefenceId = updateThesisDefenceForm
          .querySelector('.update-thesis-defence-btn')
          .getAttribute('data-thesis-defence-id')

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })

        // Make API request to update the student
        fetch(`/admin/planning/${thesisDefenceId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData), // Convert data to JSON string
        })
          .then((response) => {
            if (response.ok) {
              window.location.href = '/admin/planning'
            } else {
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
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating planning:', error)
          })
      })
    })
  }
})
