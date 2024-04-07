const deleteAnnounceBtns = document.querySelectorAll('.delete-announce')
const popup = document.getElementsByClassName('popup')[0]
const cancelBtn = document.getElementById('cancel-btn')
const deleteBtn = document.getElementById('delete-btn')
const announceId = deleteAnnounceBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popup.style.display = 'flex'
    const announceId = btn.getAttribute('data-announce-id')
    deleteBtn.addEventListener('click', function () {
      fetch(`/admin/announce/${announceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            const deleteAnnounceIcon = document.getElementById(
              'delete-announce-' + announceId,
            )
            if (deleteAnnounceIcon) {
              const announceRow = deleteAnnounceIcon.closest('tr') // Find the closest ancestor <tr> element
              if (announceRow) {
                announceRow.remove() // remove row
              }
            }
            popup.style.display = 'none'
          } else {
            const errMsj = document.getElementById('dlt-error')
            errMsj.style.display = 'block'
            console.error('Failed to delete announce')
            // Hide error message after 3 seconds
            setTimeout(function () {
              errMsj.style.display = 'none'
            }, 2000)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
  })
})
cancelBtn.addEventListener('click', function () {
  const parentElement = cancelBtn.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
})
