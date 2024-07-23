document.addEventListener('DOMContentLoaded', function () {
  const updatePremiseForms = document.querySelectorAll('.update-premise-form')
  if (updatePremiseForms.length > 0) {
    updatePremiseForms.forEach(function (updatePremiseForm) {
      updatePremiseForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updatePremiseForm) // Get form data

        const premiseId = updatePremiseForm
          .querySelector('.update-premise-btn')
          .getAttribute('data-premise-id')
        console.log('premise ID:', premiseId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))
        // Make API request to update the premise
        fetch(`/admin/premise/${premiseId}`, {
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
            window.location.href = '/admin/premises'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating premise:', error)
          })
      })
    })
  }
})
