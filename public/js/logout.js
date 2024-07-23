const logoutBtn = document.getElementById('logout-btn')
logoutBtn.addEventListener('click', async function (e) {
  e.preventDefault()
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      window.location.href = '/'
    } else {
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
  } catch (error) {
    console.error('Error:', error)
    alert('An error occurred. Please try again later.')
  }
})
