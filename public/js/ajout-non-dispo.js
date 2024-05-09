// import { Calendar } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// console.log('hello')
// // const Calendar = require('fullcalendar')
// import { Calendar } from 'fullcalendar'
// document.addEventListener('DOMContentLoaded', function () {
//   const calendarEl = document.getElementById('calendar')
//   const calendar = new Calendar(calendarEl, {
//     initialView: 'dayGridMonth',
//   })
//   calendar.render()
// })

// document.addEventListener('DOMContentLoaded', function () {
//   const calendarEl = document.getElementById('calendar')
//   const calendar = new FullCalendar.Calendar(calendarEl, {
//     initialView: 'dayGridMonth',
//   })
//   calendar.render()
// })

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar')
  const selectedDates = [] // Tableau pour stocker les dates sélectionnées

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true, // Permettre la sélection de dates
    select: function (info) {
      // Fonction appelée lorsque l'utilisateur sélectionne des dates
      selectedDates.push({ start: info.startStr, end: info.endStr })
      console.log(selectedDates)

      // Envoyer les dates sélectionnées via une requête POST
      fetch('/votre-url-de-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedDates: selectedDates }),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Dates sélectionnées envoyées avec succès')
          } else {
            console.error("Échec de l'envoi des dates sélectionnées")
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'envoi des dates sélectionnées :",
            error,
          )
        })
    },
  })
  calendar.render()
})
