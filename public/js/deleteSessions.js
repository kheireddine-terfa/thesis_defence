const btnSe = document.getElementById('delete-session-btn')
const popupSe = document.getElementsByClassName('popup')[0]
const cancelBtnSe = document.getElementById('cancel-btn-se')
const deleteBtnSe = document.getElementById('delete-btn-se')
if (btnSe) {
  btnSe.addEventListener('click', function (e) {
    e.preventDefault()
    popupSe.classList.add('show');
    deleteBtnSe.addEventListener('click', function () {
      fetch(`/admin/sessions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupSe.classList.remove('show'); 
          if (response.ok) {
            window.location.href = '/admin/sessions'
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
    })
  })
}
if (cancelBtnSe) {
  cancelBtnSe.addEventListener('click', function () {
    const parentElement = cancelBtnSe.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show');
      }
    }
  })
}
