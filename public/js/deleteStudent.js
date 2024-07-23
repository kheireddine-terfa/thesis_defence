const deleteStudentBtns = document.querySelectorAll('.delete-student')
const popupSt = document.getElementById('popup')
const errorPopupSt = document.getElementsByClassName('popup-error')[0]
const cancelBtnSt = document.getElementById('cancel-btn-st')
const deleteBtnSt = document.getElementById('delete-btn-st')
if (deleteStudentBtns.length > 0) {
  deleteStudentBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupSt.classList.add('show')
      deleteBtnSt.setAttribute('data-id', this.getAttribute('data-student-id'))
    })
  })
}
if (deleteBtnSt) {
  deleteBtnSt.addEventListener('click', function () {
    let studentId = this.getAttribute('data-id')
    if (studentId) {
      fetch(`/admin/student/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupSt.classList.remove('show')
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
if (cancelBtnSt) {
  cancelBtnSt.addEventListener('click', function () {
    const parentElement = cancelBtnSt.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show')
      }
    }
  })
}
