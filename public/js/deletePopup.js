const deleteThesisBtns = document.querySelectorAll('.delete-thesis')
const popup = document.getElementById('popup')
const cancelBtn = document.getElementById('cancel-btn-pp')
const deleteBtn = document.getElementById('delete-btn-pp')
const errorPopupP = document.getElementsByClassName('popup-error')[0]

if (deleteThesisBtns.length > 0) {
  deleteThesisBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popup.classList.add('show');
      deleteBtn.setAttribute('data-id', this.getAttribute('data-thesis-id'))
    })
  })
}
if (deleteBtn) {
  deleteBtn.addEventListener('click', function () {
    let thesisId = this.getAttribute('data-id')
    if (thesisId) {
      fetch(`/professor/thesis/${thesisId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            const deleteThesisIcon = document.getElementById(
              'delete-thesis-' + thesisId,
            )
            if (deleteThesisIcon) {
              const thesisRow = deleteThesisIcon.closest('tr') // Find the closest ancestor <tr> element
              if (thesisRow) {
                thesisRow.remove() // remove row
              }
            }
            popup.style.display = 'none'
          } else {
            popup.style.display = 'none'
            response.json().then((data) => {
              console.log('Error:', data.message)
              // Display error message to the user
              const errorMessageElement = document.getElementById(
                'popup-error-content',
              )
              errorMessageElement.textContent = data.message
              errorPopupP.style.display = 'flex' // Show error message
              setTimeout(() => {
                errorPopupP.style.display = 'none'
              }, 3000)
            })
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
