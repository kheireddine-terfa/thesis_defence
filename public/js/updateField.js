document.addEventListener('DOMContentLoaded', function () {
  const updateFieldForms = document.querySelectorAll('.update-field-form')
  if (updateFieldForms.length > 0) {
    updateFieldForms.forEach(function (updateFieldForm) {
      updateFieldForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateFieldForm) // Get form data

        const fieldId = updateFieldForm
          .querySelector('.update-field-btn')
          .getAttribute('data-field-id')
        console.log('field ID:', fieldId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))
        // Make API request to update the field
        fetch(`/admin/field/${fieldId}`, {
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
            window.location.href = '/admin/fields'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating field:', error)
          })
      })
    })
  }
})
