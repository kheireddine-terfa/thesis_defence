document.addEventListener('DOMContentLoaded', function () {
  const updateSpecialityForms = document.querySelectorAll(
    '.update-speciality-form',
  )
  if (updateSpecialityForms.length > 0) {
    updateSpecialityForms.forEach(function (updateSpecialityForm) {
      updateSpecialityForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateSpecialityForm) // Get form data

        const specialityId = updateSpecialityForm
          .querySelector('.update-speciality-btn')
          .getAttribute('data-speciality-id')
        console.log('speciality ID:', specialityId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))
        // Make API request to update the speciality
        fetch(`/admin/speciality/${specialityId}`, {
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
            window.location.href = '/admin/specialities'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating speciality:', error)
          })
      })
    })
  }
})
