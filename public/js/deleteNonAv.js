const deleteNonAvBtns = document.querySelectorAll('.delete-nonAv')
const popupN = document.getElementById('popup')
const cancelBtnN = document.getElementById('cancel-btn-no')
const deleteBtnN = document.getElementById('delete-btn-no')
if (deleteNonAvBtns.length > 0) {
  deleteNonAvBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupN.style.display = 'flex'
      deleteBtnN.setAttribute('data-id', this.getAttribute('data-nonAv-id'))
    })
  })
}
if (deleteBtnN) {
  deleteBtnN.addEventListener('click', function () {
    let nonAvId = this.getAttribute('data-id')
    console.log('**********' + nonAvId)
    if (nonAvId) {
      fetch(`/admin/non-availibility/${nonAvId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
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
            popupN.style.display = 'none'
          } else {
            const errMsj = document.getElementById('dlt-error')
            errMsj.style.display = 'block'
            console.error('Failed to delete non availibility')
            // Hide error message after 3 seconds
            setTimeout(function () {
              errMsj.style.display = 'none'
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
        grandparentElement.style.display = 'none'
      }
    }
  })
}
