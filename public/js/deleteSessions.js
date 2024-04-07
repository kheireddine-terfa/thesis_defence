const btn = document.getElementById('delete-session-btn')
const popupS = document.getElementsByClassName('popup')[0]
const cancelBtnS = document.getElementById('cancel-btn')
const deleteBtnS = document.getElementById('delete-btn')

btn.addEventListener('click', function (e) {
  e.preventDefault()
  popupS.style.display = 'flex'
  deleteBtnS.addEventListener('click', function () {
    fetch(`/admin/sessions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          popupS.style.display = 'none'
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
cancelBtnS.addEventListener('click', function () {
  const parentElement = cancelBtnS.parentElement
  if (parentElement) {
    const grandparentElement = parentElement.parentElement
    if (grandparentElement) {
      grandparentElement.style.display = 'none'
    }
  }
})
