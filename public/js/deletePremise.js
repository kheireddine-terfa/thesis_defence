const deletePremiseBtns = document.querySelectorAll('.delete-premise')
const popupP = document.getElementById('popup')
const errorPopupP = document.getElementsByClassName('popup-error')[0]
const cancelBtnP = document.getElementById('cancel-btn-p')
const deleteBtnP = document.getElementById('delete-btn-p')
if (deletePremiseBtns.length > 0) {
  deletePremiseBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupP.classList.add('show');
      deleteBtnP.setAttribute('data-id', this.getAttribute('data-premise-id'))
    })
  })
}
if (deleteBtnP) {
  deleteBtnP.addEventListener('click', function () {
    let premiseId = this.getAttribute('data-id')
    if (premiseId) {
      fetch(`/admin/premise/${premiseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupP.classList.add('show');
          if (response.ok) {
            const deletePremiseIcon = document.getElementById(
              'delete-premise-' + premiseId,
            )
            if (deletePremiseIcon) {
              const premiseRow = deletePremiseIcon.closest('tr') // Find the closest ancestor <tr> element
              if (premiseRow) {
                premiseRow.remove() // remove row
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
              errPopup.classList.add('show'); // Show error message
              setTimeout(() => {
                errPopup.classList.remove('show');
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
if (cancelBtnP) {
  cancelBtnP.addEventListener('click', function () {
    const parentElement = cancelBtnP.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show');
      }
    }
  })
}
