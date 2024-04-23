const deleteSpecialityBtns = document.querySelectorAll('.delete-speciality')
const popupS = document.getElementsByClassName('popup')[0]
const errorPopupS = document.getElementsByClassName('popup-error')[0]
const cancelBtnS = document.getElementById('cancel-btn')
const deleteBtnS = document.getElementById('delete-btn')
const specialityId = deleteSpecialityBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popupS.style.display = 'flex'
    deleteBtnS.setAttribute('data-id', btn.getAttribute('data-speciality-id'))
  })
})
deleteBtnS.addEventListener('click', function () {
  const specialityId = this.getAttribute('data-id')
  fetch(`/admin/speciality/${specialityId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        const deleteSpecialityIcon = document.getElementById(
          'delete-speciality-' + specialityId,
        )
        if (deleteSpecialityIcon) {
          const specialityRow = deleteSpecialityIcon.closest('tr') // Find the closest ancestor <tr> element
          if (specialityRow) {
            specialityRow.remove() // remove row
          }
        }
        popupS.style.display = 'none'
      } else {
        response.json().then((data) => {
          console.log('Error:', data.message)
          // Display error message to the user
          const errorMessageElement = document.getElementById(
            'popup-error-content',
          )
          errorMessageElement.textContent = data.message
          errorPopupS.style.display = 'flex' // Show error message
          setTimeout(() => {
            errorPopupS.style.display = 'none'
          }, 3000)
        })
      }
    })
    .catch((error) => {
      // console.error('Error:', error)
    })
})
cancelBtnS.addEventListener('click', function () {
  const parentElement = cancelBtnS.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
})
