const validateBtns = document.querySelectorAll('.validate-btn')

validateBtns.forEach(function (validateBtn) {
  validateBtn.addEventListener('click', function (e) {
    e.preventDefault()
    const binomeId = validateBtn.getAttribute('data-binome-id')
    const thesisId = validateBtn.getAttribute('data-selected-thesis-id')
    const data = {
      binomeId: binomeId,
      thesisId: thesisId,
    }
    // Convert object to JSON string
    const jsonData = JSON.stringify(data)
    fetch(`/professor/thesis-validation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        window.location.href = '/professor/thesis-validation'
      })
      .catch((error) => {
        // Handle errors
        console.error('Error updating thesis:', error)
      })
  })
})
