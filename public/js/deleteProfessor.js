const deleteProfessorBtns = document.querySelectorAll('.delete-professor')
const popupPr = document.getElementById('popup')
const errorPopupPr = document.getElementsByClassName('popup-error')[0]
const cancelBtnPr = document.getElementById('cancel-btn-pr')
const deleteBtnPr = document.getElementById('delete-btn-pr')
if (deleteProfessorBtns.length > 0) {
  deleteProfessorBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupPr.classList.add('show')
      deleteBtnPr.setAttribute(
        'data-id',
        this.getAttribute('data-professor-id'),
      )
    })
  })
}
if (deleteBtnPr) {
  deleteBtnPr.addEventListener('click', function () {
    let professorId = this.getAttribute('data-id')
    if (professorId) {
      fetch(`/admin/professor/${professorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupPr.classList.remove('show')
          if (response.ok) {
            const deleteProfessorIcon = document.getElementById(
              'delete-professor-' + professorId,
            )
            if (deleteProfessorIcon) {
              const professorRow = deleteProfessorIcon.closest('tr') // Find the closest ancestor <tr> element
              if (professorRow) {
                professorRow.remove() // remove row
              }
            }
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
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  })
}
if (cancelBtnPr) {
  cancelBtnPr.addEventListener('click', function () {
    const parentElement = cancelBtnPr.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show')
      }
    }
  })
}
