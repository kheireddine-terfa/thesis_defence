const deleteThesisBtns = document.querySelectorAll('.delete-thesis')
const popup = document.getElementsByClassName('popup')[0]
const cancelBtn = document.getElementById('cancel-btn')
const deleteBtn = document.getElementById('delete-btn')
const thesisId = deleteThesisBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popup.style.display = 'flex'
    deleteBtn.setAttribute('data-id', btn.getAttribute('data-thesis-id'))
  })
})
deleteBtn.addEventListener('click', function () {
  const thesisId = this.getAttribute('data-id')
  fetch(`/professor/thesis/${thesisId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        const deleteThesisIcon = document.getElementById(
          'delete-thesis-' + thesisId,
        )
        if (deleteThesisIcon) {
          const thesisRow = deleteThesisIcon.closest('tr') // Find the closest ancestor <tr> element
          if (thesisRow) {
            thesisRow.remove() // remove row
          }
        }
        popup.style.display = 'none'
      } else {
        const errMsj = document.getElementById('dlt-error')
        errMsj.style.display = 'block'
        console.error('Failed to delete thesis')
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
cancelBtn.addEventListener('click', function () {
  const parentElement = cancelBtn.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
})
