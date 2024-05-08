import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    var calendar = new Calendar(calendarEl, {
      plugins: [ dayGridPlugin ], // Utilisez le plugin de grille journalière
      // Configuration supplémentaire du calendrier si nécessaire
    });
  
    calendar.render();
});
