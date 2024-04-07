const addBtn = document.getElementById('add-announce-btn')
const addAnnounceForm = document.querySelector('.add-announce-form')

addBtn.addEventListener('click', function (e) {
  e.preventDefault()

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
