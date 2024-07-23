const generatePlanningBtn = document.getElementById('generate-planning-btn')
if (generatePlanningBtn) {
  generatePlanningBtn.addEventListener('click', (e) => {
    e.preventDefault()
    fetch(`/admin/planning`, {
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
            const errPopup = document.getElementById('popup-error')
            errPopup.classList.add('show') // Show error message
            setTimeout(() => {
              errPopup.classList.remove('show')
            }, 3000)
          })
        } else {
          const loader = document.getElementById('loader')
          const loaderContent = document.getElementById('loader-content')
          loaderContent.textContent = 'generating planning... please wait'
          loader.style.display = 'flex'
          setTimeout(() => {
            loader.style.display = 'none'
            window.location.href = '/admin/planning'
          }, 2000)
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.error('Error generating planning:', error)
      })
  })
}
