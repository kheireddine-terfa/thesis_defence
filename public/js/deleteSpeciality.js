const deleteSpecialityBtns = document.querySelectorAll('.delete-speciality')
const popupS = document.getElementById('popup')
const errorPopupS = document.getElementsByClassName('popup-error')[0]
const cancelBtnS = document.getElementById('cancel-btn-sp')
const deleteBtnS = document.getElementById('delete-btn-sp')
if (deleteSpecialityBtns.length > 0) {
  deleteSpecialityBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupS.classList.add('show')
      deleteBtnS.setAttribute(
        'data-id',
        this.getAttribute('data-speciality-id'),
      )
    })
  })
}
if (deleteBtnS) {
  deleteBtnS.addEventListener('click', function () {
    let specialityId = this.getAttribute('data-id')
    if (specialityId) {
      fetch(`/admin/speciality/${specialityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupS.classList.remove('show')
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
          // console.error('Error:', error)
        })
    }
  })
}
if (cancelBtnS) {
  cancelBtnS.addEventListener('click', function () {
    const parentElement = cancelBtnS.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show')
      }
    }
  })
}
