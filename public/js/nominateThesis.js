const nominateBtns = document.querySelectorAll('.nominate-btn')
if (nominateBtns.length > 0) {
  nominateBtns.forEach(function (nominateBtn) {
    nominateBtn.addEventListener('change', function (e) {
      e.preventDefault()
      const thesisId = nominateBtn.getAttribute('data-thesis-id')
      const data = {
        thesisId: thesisId,
      }
      // Convert object to JSON string
      const jsonData = JSON.stringify(data)
      if (e.target.checked) {
        fetch(`/binome/thesis-nominate`, {
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
            const selectedT = document.getElementById('selected-t')
            const counter = document.getElementById('selected-counter')
            if (selectedT) {
              selectedT.style.display = 'block'
              counter.textContent = data.thesisNumber

              setTimeout(function () {
                selectedT.style.display = 'none'
              }, 2000)
            }
            console.log(data)
            const thesisRow = nominateBtn.closest('tr')
            if (thesisRow) {
              thesisRow.classList.add('selected')
            }
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating thesis:', error)
          })
      } else {
        fetch(`/binome/thesis-cancel-nominate`, {
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
            const selectedT = document.getElementById('selected-t')
            const counter = document.getElementById('selected-counter')
            if (selectedT) {
              selectedT.style.display = 'block'
              counter.textContent = data.thesisNumber

              setTimeout(function () {
                selectedT.style.display = 'none'
              }, 2000)
            }
            console.log(data)
            const thesisRow = nominateBtn.closest('tr')
            if (thesisRow) {
              thesisRow.classList.remove('selected')
            }
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating thesis:', error)
          })
      }
    })
  })
}
