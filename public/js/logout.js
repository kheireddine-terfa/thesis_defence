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
      // Failed login
      alert(data.message)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('An error occurred. Please try again later.')
  }
})
