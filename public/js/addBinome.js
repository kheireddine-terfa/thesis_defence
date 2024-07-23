const addBinomeBtn = document.getElementById('add-binome-btn')
const addBinomeForm = document.querySelector('.add-binome-form')
if (addBinomeBtn) {
  addBinomeBtn.addEventListener('click', function (e) {
    e.preventDefault()
    // Check if the first select input is filled
    const etudiant1 = document.getElementById('etudiant1')
    if (etudiant1.value.trim() === '' || etudiant1.selectedIndex === 0) {
      etudiant1.classList.add('is-invalid')
      return // Stop further execution if the first select input is empty
    }

    const formData = new FormData(addBinomeForm) // Get form data
    // Convert form data to JSON object
    const jsonData = {}
    formData.forEach(function (value, key) {
      jsonData[key] = value
    })
    fetch(`/admin/binome`, {
      method: 'POST',
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
        const addPopUp = document.getElementById('popup-add')
        const popUpContent = document.getElementById('popup-content')
        popUpContent.textContent = `binome ${data.binome.userName} added successfully`
        if (addPopUp) {
          addPopUp.classList.add('show')
        }
        setTimeout(() => {
          addPopUp.classList.remove('show')
          addBinomeForm.reset()
          window.location.href = '/admin/binome'
        }, 1000)
      })
      .catch((error) => {
        // Handle errors
        console.error('Error adding  announce:', error)
      })
  })
}
