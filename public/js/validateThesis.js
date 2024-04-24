const validateBtns = document.querySelectorAll('.validate-btn')
if (validateBtns.length > 0) {
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
          const thesisRow = validateBtn.closest('tr') // Find the closest ancestor <tr> element
          if (thesisRow) {
            thesisRow.remove() // remove row
          }
          return response.json()
        })
        .then((data) => {
          window.location.href = '/professor/thesis-validation'
        })
        .catch((error) => {
          // Handle errors
          // show error
          console.error('Error validating thesis:', error)
        })
    })
  })
}
