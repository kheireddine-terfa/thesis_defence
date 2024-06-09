const deleteAnnounceBtns = document.querySelectorAll('.delete-announce')
const popup = document.getElementById('popup')
const cancelBtn = document.getElementById('cancel-btn-an')
const deleteBtn = document.getElementById('delete-btn-an')
if (deleteAnnounceBtns.length > 0) {
  deleteAnnounceBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      popup.classList.add('show');
      deleteBtn.setAttribute('data-id', this.getAttribute('data-announce-id'))
    })
  })
}

if (deleteBtn) {
  deleteBtn.addEventListener('click', function deleteHandler() {
    let announceId = this.getAttribute('data-id')
    if (announceId) {
      fetch(`/admin/announce/${announceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popup.classList.remove('show');
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
          } else {
            const errMsj = document.getElementById('dlt-error')
            const errPopup = document.getElementById('popup-error')
            errPopup.classList.add('show');
            console.error('Failed to delete announce')
            // Hide error message after 3 seconds
            setTimeout(function () {
              errPopup.classList.remove('show');
            }, 2000)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  })
}
if (cancelBtn) {
  cancelBtn.addEventListener('click', function () {
    const parentElement = cancelBtn.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show');
      }
    }
  })
}
