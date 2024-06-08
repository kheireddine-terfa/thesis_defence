const btnJu = document.getElementById('delete-juries-btn')
const popupJu = document.getElementsByClassName('popup')[0]
const cancelBtnJu = document.getElementById('cancel-btn-ju')
const deleteBtnJu = document.getElementById('delete-btn-ju')
if (btnJu) {
  btnJu.addEventListener('click', function (e) {
    e.preventDefault()
    popupJu.style.display = 'flex'
    deleteBtnJu.addEventListener('click', function () {
      fetch(`/admin/juries`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            popupJu.style.display = 'none'
            window.location.href = '/admin/juries'
          } else {
            response.json().then((data) => {
              console.log('Error:', data.message)
              // Display error message to the user
              const errorMessageElement = document.getElementById(
                'popup-error-content',
              )
              errorMessageElement.textContent = data.message
              errorPopupPr.style.display = 'flex' // Show error message
              setTimeout(() => {
                errorPopupPr.style.display = 'none'
              }, 3000)
            })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
  })
}
if (cancelBtnJu) {
  cancelBtnJu.addEventListener('click', function () {
    const parentElement = cancelBtnJu.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.style.display = 'none'
      }
    }
  })
}
