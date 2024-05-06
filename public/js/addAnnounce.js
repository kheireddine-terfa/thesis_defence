const addBtn = document.getElementById('add-announce-btn')
const addAnnounceForm = document.querySelector('.add-announce-form')
if (addBtn) {
  addBtn.addEventListener('click', function (e) {
    e.preventDefault()
    // Check if any required fields are empty
    const inputs = addAnnounceForm.querySelectorAll('input[required]')
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

    const title = document.getElementById('title').value // Get title value
    const content = tinymce.get('content').getContent() // Get content value from TinyMCE

    const jsonData = {
      title: title,
      content: content,
    }

    console.log(JSON.stringify(jsonData))

    fetch(`/admin/announce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
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
        popUpContent.textContent = 'announce added successfully ..'
        if (addPopUp) {
          addPopUp.style.display = 'flex'
        }
        setTimeout(() => {
          addPopUp.style.display = 'none'
          addAnnounceForm.reset()
        }, 3000)
      })
      .catch((error) => {
        console.error('Error adding announce:', error)
      })
  })
}
