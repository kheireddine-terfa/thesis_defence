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
