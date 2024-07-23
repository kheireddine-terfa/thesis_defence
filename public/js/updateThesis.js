document.addEventListener('DOMContentLoaded', function () {
  const updateThesisForms = document.querySelectorAll('.update-thesis-form')
  if (updateThesisForms.length > 0) {
    updateThesisForms.forEach(function (updateThesisForm) {
      updateThesisForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateThesisForm) // Get form data

        const thesisId = updateThesisForm
          .querySelector('.update-thesis-btn')
          .getAttribute('data-thesis-id')
        console.log('Thesis ID:', thesisId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))
        // Make API request to update the thesis
        fetch(`/professor/thesis/${thesisId}`, {
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
            window.location.href = '/professor/thesis'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating thesis:', error)
          })
      })
    })
  }
})
