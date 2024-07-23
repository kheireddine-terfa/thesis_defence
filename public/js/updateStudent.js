document.addEventListener('DOMContentLoaded', function () {
  const updateStudentForms = document.querySelectorAll('.update-student-form')
  if (updateStudentForms.length > 0) {
    updateStudentForms.forEach(function (updateStudentForm) {
      updateStudentForm.addEventListener('submit', function (event) {
        event.preventDefault() // Prevent the default form submission behavior

        const formData = new FormData(updateStudentForm) // Get form data

        const studentId = updateStudentForm
          .querySelector('.update-student-btn')
          .getAttribute('data-student-id')
        console.log('student ID:', studentId)

        // Convert form data to JSON object
        const jsonData = {}
        formData.forEach(function (value, key) {
          jsonData[key] = value
        })
        console.log(JSON.stringify(jsonData))
        // Make API request to update the student
        fetch(`/admin/student/${studentId}`, {
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
            window.location.href = '/admin/students'
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating student:', error)
          })
      })
    })
  }
})
