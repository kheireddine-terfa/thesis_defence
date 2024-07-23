const btnJu = document.getElementById('delete-juries-btn')
const popupJu = document.getElementsByClassName('popup')[0]
const cancelBtnJu = document.getElementById('cancel-btn-ju')
const deleteBtnJu = document.getElementById('delete-btn-ju')
if (btnJu) {
  btnJu.addEventListener('click', function (e) {
    e.preventDefault()
    popupJu.classList.add('show')
    deleteBtnJu.addEventListener('click', function () {
      fetch(`/admin/juries`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupJu.classList.remove('show')
          if (response.ok) {
            window.location.href = '/admin/juries'
          } else {
            response.json().then((data) => {
              console.log('Error:', data.message)
              // Display error message to the user
              const errorMessageElement = document.getElementById(
                'popup-error-content',
              )
              errorMessageElement.textContent = data.message
              const errPopup = document.getElementById('popup-error')
              errPopup.classList.add('show') // Show error message
              setTimeout(() => {
                errPopup.classList.remove('show')
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
        grandparentElement.classList.remove('show')
      }
    }
  })
}
