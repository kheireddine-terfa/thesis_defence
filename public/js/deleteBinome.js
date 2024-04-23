const deleteBinomeBtns = document.querySelectorAll('.delete-binome')
const popupB = document.getElementsByClassName('popup')[0]
const errorPopupB = document.getElementsByClassName('popup-error')[0]
const cancelBtnB = document.getElementById('cancel-btn')
const deleteBtnB = document.getElementById('delete-btn')
const binomeId = deleteBinomeBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popupB.style.display = 'flex'
    deleteBtnB.setAttribute('data-id', btn.getAttribute('data-binome-id'))
  })
})
deleteBtnB.addEventListener('click', function () {
  const binomeId = this.getAttribute('data-id')
  fetch(`/admin/binome/${binomeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
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
        popupB.style.display = 'none'
      } else {
        response.json().then((data) => {
          console.log('Error:', data.message)
          // Display error message to the user
          const errorMessageElement = document.getElementById(
            'popup-error-content',
          )
          errorMessageElement.textContent = data.message
          errorPopupB.style.display = 'flex' // Show error message
          setTimeout(() => {
            errorPopupB.style.display = 'none'
          }, 3000)
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
cancelBtnB.addEventListener('click', function () {
  const parentElement = cancelBtnB.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
})
