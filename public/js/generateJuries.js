const generateBtn = document.getElementById('generate-juries-btn')
if (generateBtn) {
  generateBtn.addEventListener('click', (e) => {
    e.preventDefault()
    fetch(`/admin/juries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
            errorPopupSt.style.display = 'flex' // Show error message
            setTimeout(() => {
              errorPopupSt.style.display = 'none'
            }, 3000)
          })
        } else {
          const loader = document.getElementById('loader')
          loader.style.display = 'flex'
          setTimeout(() => {
            loader.style.display = 'none'
            window.location.href = '/admin/juries'
          }, 3000)
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.error('Error adding announce:', error)
      })
  })
}
