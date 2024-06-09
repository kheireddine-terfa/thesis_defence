const deleteBinomeBtns = document.querySelectorAll('.delete-binome')
const popupB = document.getElementById('popup')
const errorPopupB = document.getElementsByClassName('popup-error')[0]
const cancelBtnB = document.getElementById('cancel-btn-bi')
const deleteBtnB = document.getElementById('delete-btn-bi')
if (deleteBinomeBtns.length > 0) {
  deleteBinomeBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupB.classList.add('show');
      deleteBtnB.setAttribute('data-id', this.getAttribute('data-binome-id'))
    })
  })
}
if (deleteBtnB) {
  deleteBtnB.addEventListener('click', function () {
    let binomeId = this.getAttribute('data-id')
    if (binomeId) {
      fetch(`/admin/binome/${binomeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupB.classList.remove('show');
          if (response.ok) {
            const deleteBinomeIcon = document.getElementById(
              'delete-binome-' + binomeId,
            )
            if (deleteBinomeIcon) {
              const binomeRow = deleteBinomeIcon.closest('tr') // Find the closest ancestor <tr> element
              if (binomeRow) {
                binomeRow.remove() // remove row
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
if (cancelBtnB) {
  cancelBtnB.addEventListener('click', function () {
    const parentElement = cancelBtnB.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show');
      }
    }
  })
}
