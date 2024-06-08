const deleteNonAvBtns = document.querySelectorAll('.delete-nonAv')
const popupN = document.getElementById('popup')
const cancelBtnN = document.getElementById('cancel-btn-no')
const deleteBtnN = document.getElementById('delete-btn-no')
if (deleteNonAvBtns.length > 0) {
  deleteNonAvBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupN.classList.add('show');
      deleteBtnN.setAttribute('data-id', this.getAttribute('data-nonAv-id'))
    })
  })
}
if (deleteBtnN) {
  deleteBtnN.addEventListener('click', function () {
    let nonAvId = this.getAttribute('data-id')
    if (nonAvId) {
      fetch(`/admin/non-availibility/${nonAvId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupN.classList.remove('show');
          if (response.ok) {
            const deleteNonAvIcon = document.getElementById(
              'delete-nonAv-' + nonAvId,
            )
            if (deleteNonAvIcon) {
              const nonAvRow = deleteNonAvIcon.closest('tr') // Find the closest ancestor <tr> element
              if (nonAvRow) {
                nonAvRow.remove() // remove row
              }
            }
          } else {
            const errMsj = document.getElementById('dlt-error')
            errMsj.style.display = 'block'
            console.error('Failed to delete non availibility')
            const errPopup = document.getElementById('popup-error')
            errPopup.classList.add('show'); // Show error message
            
            // Hide error message after 3 seconds
            setTimeout(function () {
              errPopup.classList.remove('show');
            }, 2000)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  })
}
if (cancelBtnN) {
  cancelBtnN.addEventListener('click', function () {
    const parentElement = cancelBtnN.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show');
      }
    }
  })
}
