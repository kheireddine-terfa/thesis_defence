const deleteThesisBtns = document.querySelectorAll('.delete-thesis')
const popup = document.getElementsByClassName('popup')[0]
const cancelBtn = document.getElementById('cancel-btn')
const deleteBtn = document.getElementById('delete-btn')
const thesisId = deleteThesisBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popup.style.display = 'flex'
    const thesisId = btn.getAttribute('data-thesis-id')
    console.log(thesisId)
    deleteBtn.addEventListener('click', function () {
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
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
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
