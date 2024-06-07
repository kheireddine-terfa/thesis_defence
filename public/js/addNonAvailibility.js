const addNonAvBtn = document.getElementById('add-non-availibility-btn')
const addNonAvForm = document.querySelector('.add-non-availibility-form')
if (addNonAvBtn) {
  addNonAvBtn.addEventListener('click', function (e) {
    e.preventDefault()
    // Check if any required fields are empty
    const inputs = addNonAvForm.querySelectorAll('input[required]')
    let isValid = true

    inputs.forEach(function (input) {
      if (input.value.trim() === '') {
        isValid = false
        input.classList.add('is-invalid')
      } else {
        input.classList.remove('is-invalid')
      }
    })

    // If any required field is empty, do not proceed with API call
    if (!isValid) {
      return
    }
    const formData = new FormData(addNonAvForm) // Get form data
    // Convert form data to JSON object
    const jsonData = {}
    formData.forEach(function (value, key) {
      jsonData[key] = value
    })
    fetch(`/admin/non-availibilities`, {
      method: 'POST',
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
        const addPopUp = document.getElementById('popup-add')
        const popUpContent = document.getElementById('popup-content')
        popUpContent.textContent = `non-availibility added successfully`
        if (addPopUp) {
          addPopUp.classList.add('show');
        }
        setTimeout(() => {
          addPopUp.classList.remove('show');
          addNonAvForm.reset()
        }, 1000)
      })
      .catch((error) => {
        // Handle errors
        console.error('Error adding  announce:', error)
      })
  })
}
