const deleteStudentBtns = document.querySelectorAll('.delete-student')
const popupSt = document.getElementsByClassName('popup')[0]
const errorPopupSt = document.getElementsByClassName('popup-error')[0]
const cancelBtnSt = document.getElementById('cancel-btn')
const deleteBtnSt = document.getElementById('delete-btn')
const studentId = deleteStudentBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popupSt.style.display = 'flex'
    deleteBtnSt.setAttribute('data-id', btn.getAttribute('data-student-id'))
  })
})
deleteBtnSt.addEventListener('click', function () {
  const studentId = this.getAttribute('data-id')
  fetch(`/admin/student/${studentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        const deleteStudentIcon = document.getElementById(
          'delete-student-' + studentId,
        )
        if (deleteStudentIcon) {
          const studentRow = deleteStudentIcon.closest('tr') // Find the closest ancestor <tr> element
          if (studentRow) {
            studentRow.remove() // remove row
          }
        }
        popupSt.style.display = 'none'
      } else {
        response.json().then((data) => {
          console.log('Error:', data.message)
          // Display error message to the user
          const errorMessageElement = document.getElementById(
            'popup-error-content',
          )
          errorMessageElement.textContent = data.message
          errorPopupSt.style.display = 'flex' // Show error message
          setTimeout(() => {
            errorPopupSt.style.display = 'none'
          }, 3000)
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
cancelBtnSt.addEventListener('click', function () {
  const parentElement = cancelBtnSt.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
})
