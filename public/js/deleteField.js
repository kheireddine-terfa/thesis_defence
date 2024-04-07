const deleteFieldBtns = document.querySelectorAll('.delete-field')
const popupF = document.getElementsByClassName('popup')[0]
const cancelBtnF = document.getElementById('cancel-btn')
const deleteBtnF = document.getElementById('delete-btn')

// Function to handle the delete button click event
function deleteButtonClickHandler(e) {
  const fieldId = e.target.getAttribute('data-field-id')
  fetch(`/admin/field/${fieldId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        const deleteFieldIcon = document.getElementById(
          'delete-field-' + fieldId,
        )
        if (deleteFieldIcon) {
          const fieldRow = deleteFieldIcon.closest('tr') // Find the closest ancestor <tr> element
          if (fieldRow) {
            fieldRow.remove() // remove row
          }
        }
        popupF.style.display = 'none'
      } else {
        const errMsj = document.getElementById('dlt-error')
        errMsj.style.display = 'block'
        console.error('Failed to delete field')
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

// Add event listeners to delete buttons
deleteFieldBtns.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    popupF.style.display = 'flex'
    deleteBtnF.addEventListener('click', function () {
      deleteButtonClickHandler(e)
    })
  })
})

// Event listener for the cancel button
cancelBtnF.addEventListener('click', function (e) {
  const parentElement = cancelBtnF.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
  // Remove the click event listener from the delete button
  deleteBtnF.removeEventListener('click', deleteButtonClickHandler)
})
