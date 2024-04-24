document.addEventListener('DOMContentLoaded', function () {
  const updateNonAvForms = document.querySelectorAll('.update-nonAv-form')
  if (updateNonAvForms.length > 0) {
    updateNonAvForms.forEach(function (updateNonAvForm) {
      updateNonAvForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateNonAvForm) // Get form data

        const nonAvId = updateNonAvForm
          .querySelector('.update-nonAv-btn')
          .getAttribute('data-nonAv-id')
        console.log('nonAv ID:', nonAvId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))
        // Make API request to update the nonAv
        fetch(`/admin/non-availibility/${nonAvId}`, {
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
            window.location.href = '/admin/non-availibilities'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating nonAvailibility:', error)
          })
      })
    })
  }
})
