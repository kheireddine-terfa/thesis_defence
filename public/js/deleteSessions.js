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
          if (response.ok) {
            popupSe.style.display = 'none'
            window.location.href = '/admin/sessions'
          } else {
            const errMsj = document.getElementById('dlt-error')
            errMsj.style.display = 'block'
            console.error('Failed to delete session')
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
