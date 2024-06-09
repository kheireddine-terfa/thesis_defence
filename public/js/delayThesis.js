const delayThesisBtns = document.querySelectorAll('.delay-thesis')
const popupDT = document.getElementById('popup')
const errorPopupDT = document.getElementsByClassName('popup-error')[0]
const cancelBtnDT = document.getElementById('cancel-btn-dt')
const deleteBtnDT = document.getElementById('delete-btn-dt')
if (delayThesisBtns.length > 0) {
  delayThesisBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      popupDT.classList.add('show')
      deleteBtnDT.setAttribute('data-id', this.getAttribute('data-delay-id'))
    })
  })
}
if (deleteBtnDT) {
  deleteBtnDT.addEventListener('click', function () {
    let delayID = this.getAttribute('data-id')
    if (delayID) {
      fetch(`/admin//affected-theses/report/${delayID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          popupB.classList.remove('show')
          if (response.ok) {
            //redirect
            window.location.href = '/admin/affected-theses'
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
          // console.error('Error:', error)
        })
    }
  })
}
if (cancelBtnDT) {
  cancelBtnDT.addEventListener('click', function () {
    const parentElement = cancelBtnDT.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show')
      }
    }
  })
}
