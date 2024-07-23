document.addEventListener('DOMContentLoaded', function () {
  const updateJuryForms = document.querySelectorAll('.update-jury-form')
  if (updateJuryForms.length > 0) {
    updateJuryForms.forEach(function (updateJuryForm) {
      updateJuryForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateJuryForm) // Get form data

        const juryId = updateJuryForm
          .querySelector('.update-jury-btn')
          .getAttribute('data-jury-id')
        console.log('jury ID:', juryId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))
        // Make API request to update the jury
        fetch(`/admin/jury/${juryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData), // Convert data to JSON string
        })
          .then((response) => {
            if (response.ok) {
              window.location.href = '/admin/juries'
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
          .then((data) => {})
          .catch((error) => {
            // Handle errors
            console.error('Error updating jury:', error)
          })
      })
    })
  }
})
