document.addEventListener('DOMContentLoaded', function () {
  const updatePasswordForms = document.querySelectorAll('.update-password-form')
  updatePasswordForms.forEach(function (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', function (event) {
      event.preventDefault() // Prevent the default form submission behavior
      const formData = new FormData(updatePasswordForm) // Get form data

      const user = updatePasswordForm
        .querySelector('.update-password-btn')
        .getAttribute('data-user-type')

      // Convert form data to JSON object
      const jsonData = {}
      formData.forEach(function (value, key) {
        jsonData[key] = value
      })
      // Make API request to update the password
      fetch(`/${user}/password`, {
        method: 'PATCH',
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
          // i need to display a popup here
          const addPopUp = document.getElementById('popup-add')
          const popUpContent = document.getElementById('popup-content')
          popUpContent.textContent =
            'your password has been updated successfully , please login again to get access ..'
          if (addPopUp) {
            addPopUp.style.display = 'flex'
          }
          setTimeout(() => {
            window.location.href = `/${user}/login`
          }, 3000)
        })
        .catch((error) => {
          // Handle errors
          console.error('Error updating premise:', error)
        })
    })
  })
})
