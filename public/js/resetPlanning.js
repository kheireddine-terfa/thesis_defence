const btnPl = document.getElementById('delete-planning-btn')
const popupPl = document.getElementsByClassName('popup')[0]
const cancelBtnPl = document.getElementById('cancel-btn-pl')
const deleteBtnPl = document.getElementById('delete-btn-pl')
if (btnPl) {
  btnPl.addEventListener('click', function (e) {
    e.preventDefault()
    popupPl.classList.add('show');
    deleteBtnPl.addEventListener('click', function () {
      fetch(`/admin/planning`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            popupPl.classList.remove('show')
            window.location.href = '/admin/planning'
          } else {
            const errMsj = document.getElementById('dlt-error')
            errMsj.style.display = 'block'
            console.error('Failed to delete planning')
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
if (cancelBtnPl) {
  cancelBtnPl.addEventListener('click', function () {
    const parentElement = cancelBtnPl.parentElement
    if (parentElement) {
      const grandparentElement = parentElement.parentElement
      if (grandparentElement) {
        grandparentElement.classList.remove('show');
      }
    }
  })
}
