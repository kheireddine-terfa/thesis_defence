document.addEventListener('DOMContentLoaded', function () {
  const updateSessionForms = document.querySelectorAll('.update-session-form')
  if (updateSessionForms.length > 0) {
    updateSessionForms.forEach(function (updateSessionForm) {
      updateSessionForm.addEventListener('submit', function (event) {
        event.preventDefault()
        const formData = new FormData(updateSessionForm) // Get form data

        const updateSessionBtn = document.getElementById('update-session-btn')
        if (!updateSessionBtn) {
          console.error('Update session button not found')
          return
        }

        const sessionId = updateSessionBtn.getAttribute('data-session-id')
        if (!sessionId) {
          console.error('Session ID attribute not found')
          return
        }
        console.log('Session ID:', sessionId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))

        // Make API request to update the session
        fetch(`/admin/session/${sessionId}`, {
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
            window.location.href = '/admin/sessions'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating session:', error)
          })
      })
    })
  }
})
