document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('#login-form')
  const loginBtn = document.getElementById('login-btn')
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault()

    const formData = new FormData(loginForm)
    const email = formData.get('email')
    const password = formData.get('password')
    const url = loginBtn.getAttribute('data-url')
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password in JSON format
      })

      const data = await response.json()
      if (response.ok) {
        // redirect based on role
        switch (data.role) {
          case 'admin':
            window.location.href = '/admin'
            break
          case 'professor':
            window.location.href = '/professor'
            break
          case 'binome':
            window.location.href = '/binome'
            break
          default:
            console.error('Invalid role returned from server')
            break
        }
      } else {
        // Failed login
        alert(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again later.')
    }
  })
})
