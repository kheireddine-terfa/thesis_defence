const deleteProfessorBtns = document.querySelectorAll('.delete-professor')
const popupPr = document.getElementsByClassName('popup')[0]
const errorPopupPr = document.getElementsByClassName('popup-error')[0]
const cancelBtnPr = document.getElementById('cancel-btn')
const deleteBtnPr = document.getElementById('delete-btn')
const professorId = deleteProfessorBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popupPr.style.display = 'flex'
    deleteBtnPr.setAttribute('data-id', btn.getAttribute('data-professor-id'))
  })
})
deleteBtnPr.addEventListener('click', function () {
  const professorId = this.getAttribute('data-id')
  fetch(`/admin/professor/${professorId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
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
        popupPr.style.display = 'none'
      } else {
        response.json().then((data) => {
          console.log('Error:', data.message)
          // Display error message to the user
          const errorMessageElement = document.getElementById(
            'popup-error-content',
          )
          errorMessageElement.textContent = data.message
          errorPopupPr.style.display = 'flex' // Show error message
          setTimeout(() => {
            errorPopupPr.style.display = 'none'
          }, 3000)
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
cancelBtnPr.addEventListener('click', function () {
  const parentElement = cancelBtnPr.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
})
