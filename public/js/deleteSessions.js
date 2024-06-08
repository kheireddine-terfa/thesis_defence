const btnSe = document.getElementById('delete-session-btn')
const popupSe = document.getElementsByClassName('popup')[0]
const cancelBtnSe = document.getElementById('cancel-btn-se')
const deleteBtnSe = document.getElementById('delete-btn-se')
if (btnSe) {
  btnSe.addEventListener('click', function (e) {
    e.preventDefault()
    popupSe.style.display = 'flex'
    deleteBtnSe.addEventListener('click', function () {
      fetch(`/admin/sessions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            popupSe.style.display = 'none'
            window.location.href = '/admin/sessions'
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
if (cancelBtnSe) {
  cancelBtnSe.addEventListener('click', function () {
    const parentElement = cancelBtnSe.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.style.display = 'none'
      }
    }
  })
}
