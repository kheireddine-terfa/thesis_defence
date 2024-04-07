const deleteBinomeBtns = document.querySelectorAll('.delete-binome')
const popupB = document.getElementsByClassName('popup')[0]
const cancelBtnB = document.getElementById('cancel-btn')
const deleteBtnB = document.getElementById('delete-btn')
const binomeId = deleteBinomeBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popupB.style.display = 'flex'
    const binomeId = btn.getAttribute('data-binome-id')
    deleteBtnB.addEventListener('click', function () {
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
            const errMsj = document.getElementById('dlt-error')
            errMsj.style.display = 'block'
            console.error('Failed to delete binome')
            // Hide error message after 3 seconds
            setTimeout(function () {
              errMsj.style.display = 'none'
            }, 2000)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
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
